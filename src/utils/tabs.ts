import { StoreManager } from "./storage";
import { SW } from "./proxy";

interface Tab {
    id: string;
    iframe: HTMLIFrameElement;
    url: string;
    title: string;
    favicon: string;
}

class TabManager {
    #tabs: Map<string, Tab> = new Map();
    #activeTabId: string | null = null;
    #storageManager: StoreManager<"radius||settings">;
    #sw?: SW;
    #container: HTMLElement | null = null;
    #tabsListContainer: HTMLElement | null = null;
    static #instance: TabManager | null = null;

    private constructor() {
        this.#storageManager = new StoreManager("radius||settings");
        
        // Listen for storage changes across all tabs
        window.addEventListener("storage", (e) => {
            if (e.key?.startsWith("radius||settings||")) {
                this.#syncSettingsToAllTabs();
            }
        });
    }

    static getInstance(): TabManager {
        if (!TabManager.#instance) {
            TabManager.#instance = new TabManager();
        }
        return TabManager.#instance;
    }

    init(container: HTMLElement, tabsListContainer: HTMLElement): void {
        this.#container = container;
        this.#tabsListContainer = tabsListContainer;
    }

    createTab(url?: string): string {
        const tabId = crypto.randomUUID();
        const iframe = document.createElement("iframe");
        iframe.id = `tab-${tabId}`;
        iframe.className = "w-full h-full absolute inset-0 border-none hidden";
        iframe.setAttribute("allowfullscreen", "true");
        
        const tab: Tab = {
            id: tabId,
            iframe,
            url: url || "",
            title: "New Tab",
            favicon: "/favicon.png"
        };

        this.#tabs.set(tabId, tab);
        
        // Append iframe to container
        this.#container?.appendChild(iframe);

        // Setup iframe load listener
        iframe.addEventListener("load", () => {
            this.#updateTabInfo(tabId);
        });

        if (url) {
            this.loadUrl(tabId, url);
        }

        return tabId;
    }

    loadUrl(tabId: string, url: string): void {
        const tab = this.#tabs.get(tabId);
        if (!tab) return;

        // Get SW instance lazily
        if (!this.#sw) {
            const swInstance = SW.getInstance().next().value;
            if (!swInstance) {
                console.error("SW instance not ready");
                return;
            }
            this.#sw = swInstance;
        }

        const encodedUrl = this.#sw.encodeURL(url);
        tab.iframe.src = encodedUrl;
        tab.url = url;
        
        // Update tab title immediately
        tab.title = this.#getTitleFromUrl(url);
        this.#updateTabButton(tabId);
    }

    switchTab(tabId: string): void {
        // Hide all tabs
        this.#tabs.forEach(tab => {
            tab.iframe.classList.add("hidden");
        });

        // Show selected tab
        const tab = this.#tabs.get(tabId);
        if (tab) {
            tab.iframe.classList.remove("hidden");
            this.#activeTabId = tabId;
            this.#updateActiveTabStyle();
        }
    }

    closeTab(tabId: string): void {
        // Ensure at least one tab remains open
        if (this.#tabs.size <= 1) {
            return;
        }

        const tab = this.#tabs.get(tabId);
        if (tab) {
            tab.iframe.remove();
            this.#tabs.delete(tabId);
            
            // Remove tab button
            const tabBtn = document.getElementById(`tab-btn-${tabId}`);
            tabBtn?.remove();
            
            if (this.#activeTabId === tabId) {
                const remainingTabs = Array.from(this.#tabs.keys());
                if (remainingTabs.length > 0) {
                    this.switchTab(remainingTabs[0]);
                }
            }
        }
    }

    #updateTabInfo(tabId: string): void {
        const tab = this.#tabs.get(tabId);
        if (!tab) return;

        try {
            const iframeWindow = tab.iframe.contentWindow;
            if (iframeWindow && iframeWindow.document) {
                tab.title = iframeWindow.document.title || tab.title;
                
                // Try to get favicon
                const faviconEl = iframeWindow.document.querySelector<HTMLLinkElement>("link[rel~='icon']");
                if (faviconEl && faviconEl.href) {
                    tab.favicon = faviconEl.href;
                }
            }
        } catch (e) {
            // Cross-origin restrictions - use default
        }

        this.#updateTabButton(tabId);
    }

    #getTitleFromUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname || "New Tab";
        } catch {
            return url.substring(0, 20) || "New Tab";
        }
    }

    #updateTabButton(tabId: string): void {
        const tab = this.#tabs.get(tabId);
        if (!tab) return;

        const tabBtn = document.getElementById(`tab-btn-${tabId}`);
        if (tabBtn) {
            const titleEl = tabBtn.querySelector(".tab-title");
            if (titleEl) {
                titleEl.textContent = tab.title.substring(0, 20);
            }
        }
    }

    renderTabButton(tabId: string): void {
        const tab = this.#tabs.get(tabId);
        if (!tab) return;

        const tabBtn = document.createElement("button");
        tabBtn.id = `tab-btn-${tabId}`;
        tabBtn.className = "flex items-center gap-2 px-4 py-2 rounded-full bg-(--secondary) hover:bg-(--secondary)/[0.8] transition-colors max-w-[200px] group";
        tabBtn.innerHTML = `
            <span class="tab-title text-sm truncate flex-1 text-left">${tab.title}</span>
            <button class="close-tab opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 text-lg leading-none" data-tab-id="${tabId}" title="Close tab">×</button>
        `;

        tabBtn.addEventListener("click", (e) => {
            if (!(e.target as HTMLElement).classList.contains("close-tab")) {
                this.switchTab(tabId);
            }
        });

        const closeBtn = tabBtn.querySelector(".close-tab");
        closeBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.closeTab(tabId);
        });

        this.#tabsListContainer?.appendChild(tabBtn);
    }

    #updateActiveTabStyle(): void {
        document.querySelectorAll("[id^='tab-btn-']").forEach(btn => {
            btn.classList.remove("ring-2", "ring-(--primary)");
        });
        if (this.#activeTabId) {
            const activeBtn = document.getElementById(`tab-btn-${this.#activeTabId}`);
            activeBtn?.classList.add("ring-2", "ring-(--primary)");
        }
    }

    #syncSettingsToAllTabs(): void {
        // When settings change, notify all iframes
        this.#tabs.forEach(tab => {
            const iframeWindow = tab.iframe.contentWindow;
            if (iframeWindow) {
                try {
                    iframeWindow.postMessage({
                        type: "settings-updated",
                        settings: {
                            proxy: this.#storageManager.getVal("proxy"),
                            transport: this.#storageManager.getVal("transport"),
                            searchEngine: this.#storageManager.getVal("searchEngine"),
                            adBlock: this.#storageManager.getVal("adBlock")
                        }
                    }, "*");
                } catch (e) {
                    // Cross-origin restrictions
                }
            }
        });
    }

    getActiveTab(): Tab | undefined {
        return this.#activeTabId ? this.#tabs.get(this.#activeTabId) : undefined;
    }

    getActiveTabIframe(): HTMLIFrameElement | undefined {
        const tab = this.getActiveTab();
        return tab?.iframe;
    }

    getAllTabs(): Tab[] {
        return Array.from(this.#tabs.values());
    }

    getTabCount(): number {
        return this.#tabs.size;
    }
}

export { TabManager, type Tab };