class TabManager {
    private tabs: Array<{ id: string; url: string }> = [];
    private currentTabIndex: number = 0;

    constructor() {
        this.loadTabs();
    }

    private loadTabs() {
        const savedTabs = localStorage.getItem('tabs');
        if (savedTabs) {
            this.tabs = JSON.parse(savedTabs);
        }
        if (this.tabs.length === 0) {
            this.addTab('about:blank');
        }
    }

    private saveTabs() {
        localStorage.setItem('tabs', JSON.stringify(this.tabs));
    }

    addTab(url: string) {
        const tabId = this.generateTabId();
        this.tabs.push({ id: tabId, url });
        this.saveTabs();
    }

    switchTab(index: number) {
        if (index >= 0 && index < this.tabs.length) {
            this.currentTabIndex = index;
            this.loadCurrentTab();
        }
    }

    closeTab(index: number) {
        if (this.tabs.length > 1) {
            this.tabs.splice(index, 1);
            this.currentTabIndex = Math.min(this.currentTabIndex, this.tabs.length - 1);
            this.saveTabs();
        }
    }

    loadCurrentTab() {
        const currentTab = this.tabs[this.currentTabIndex];
        if (currentTab) {
            console.log(`Loading URL: ${currentTab.url}`);
            // Logic to load the URL in an iframe would go here
        }
    }

    private generateTabId(): string {
        return 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    syncSettings(settings: any) {
        // Logic to sync settings across tabs
    }
}

// Example usage:
const tabManager = new TabManager();
tabManager.addTab('https://example.com');
tabManager.switchTab(0);
tabManager.closeTab(0);