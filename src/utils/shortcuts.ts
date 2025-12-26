import { StoreManager } from "./storage";

type SavedShortcut = {
    url: string;
    title: string;
    imageUrl?: string;
};

const storageManager = new StoreManager<"radius||settings">("radius||settings");
const savedShortcutsKey = "savedShortcuts";

const normalizeUrl = (url: string): string => url.replace(/\/+$/, "");

const buildRedirect = (url: string): string => {
    try {
        return `/?redir=${btoa(url)}`;
    } catch (_) {
        return `/?redir=${encodeURIComponent(url)}`;
    }
};

const getFaviconUrl = (url: string): string => {
    try {
        const hostname = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch (_) {
        return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    }
};

const getSavedShortcuts = (): SavedShortcut[] => {
    const stored = storageManager.getVal(savedShortcutsKey);
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item) => typeof item?.url === "string" && typeof item?.title === "string");
    } catch (_) {
        return [];
    }
};

const setSavedShortcuts = (shortcuts: SavedShortcut[]): void => {
    storageManager.setVal(savedShortcutsKey, JSON.stringify(shortcuts));
};

const isSavedShortcut = (url: string, shortcuts = getSavedShortcuts()): boolean => {
    const normalized = normalizeUrl(url);
    return shortcuts.some((item) => normalizeUrl(item.url) === normalized);
};

const toggleSavedShortcut = (url: string, title: string): { saved: boolean; shortcuts: SavedShortcut[] } => {
    if (!url) {
        return { saved: false, shortcuts: getSavedShortcuts() };
    }
    const shortcuts = getSavedShortcuts();
    const normalized = normalizeUrl(url);
    const existingIndex = shortcuts.findIndex((item) => normalizeUrl(item.url) === normalized);
    if (existingIndex >= 0) {
        shortcuts.splice(existingIndex, 1);
        setSavedShortcuts(shortcuts);
        return { saved: false, shortcuts };
    }

    let finalTitle = title?.trim();
    if (!finalTitle) {
        try {
            finalTitle = new URL(url).hostname;
        } catch (_) {
            finalTitle = url;
        }
    }

    shortcuts.push({
        url,
        title: finalTitle,
        imageUrl: getFaviconUrl(url)
    });
    setSavedShortcuts(shortcuts);
    return { saved: true, shortcuts };
};

export {
    type SavedShortcut,
    buildRedirect,
    getFaviconUrl,
    getSavedShortcuts,
    isSavedShortcut,
    toggleSavedShortcut
};
