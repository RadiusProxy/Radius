import type { Props } from "astro";

interface SettingsProps extends Props {
    active: "appearance" | "credits" | "links" | "proxy" | "cloaking";
    title: string;
}

type DropdownOptions = {
    name: string;
    value: string;
    default?: boolean;
};

const SearchEngines: Record<string, string> = {
    DuckDuckGo: "https://duckduckgo.com/?q=%s",
    Google: "https://google.com/search?q=%s",
    Bing: "https://bing.com/search?q=%s"
};

export { type SettingsProps, type DropdownOptions, SearchEngines };
