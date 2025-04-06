import type { Props } from "astro";

interface SettingsProps extends Props {
    active: 'appearance' | 'credits' | 'links' | 'proxy';
}

export type { SettingsProps };
