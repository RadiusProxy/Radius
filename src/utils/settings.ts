import { StoreManager } from "./storage";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { SW } from "@utils/proxy.ts";
import { SearchEngines } from "./types";
/**
 * The settings class
 * Initializes it's own StorageManager, and handles everything within the class itself
 *
 * @example
 * // Create a new Settings instance (needs to be done only once)
 * import { Settings } from "@utils/settings.ts";
 * const settings = new Settings();
 * //Consume any of the methods with:
 * settings.methodName();
 *
 * // Most of the time, you'll want to get the running instance this can be done with
 * import { Settings } from "@utils/settings.ts";
 * const settings = await Settings.getInstance();
 * //Consume any of the methods with:
 * settings.methodName();
 */
class Settings {
    // Our own internal StorageManager so things never interfere
    #storageManager: StoreManager<"radius||settings">;
    static #instance = new Set();

    /**
     * Method to get the current or other Settings instance(s)
     *
     *
     * @example
     * const settings = await Settings.getInstance();
     * // Consume the other methods
     */
    static async getInstance() {
        function* get() {
            for (const instance of Settings.#instance.keys()) {
                yield instance!;
            }
        }

        const ready = (): Promise<boolean> => {
            return new Promise((resolve) => {
                const i = setInterval(() => {
                    if (Settings.#instance.size !== 0) {
                        clearInterval(i);
                        resolve(true);
                    }
                }, 100);
            });
        };

        await ready();
        return get().next().value! as Settings;
    }

    /**
     * Set's the theme either to the current theme OR to a new one
     *
     * @example
     * // Retrieve the Settings instance
     * const settings = await Settings.getInstance();
     *
     * // Consume the method
     * settings.theme() // Whatever value is in localstorage at the time
     * settings.theme('theme name') // A new theme based off of the class name
     */
    theme(theme?: string) {
        this.#storageManager.setVal("theme", theme || this.#storageManager.getVal("theme"));
        theme === "default"
            ? (document.documentElement.className = "default")
            : (document.documentElement.className = theme || this.#storageManager.getVal("theme"));
    }

    proxy(prox?: "uv" | "sj") {
        this.#storageManager.setVal("proxy", prox || "uv");
    }

    searchEngine(engine?: string) {
        this.#storageManager.setVal("searchEngine", engine || SearchEngines.DuckDuckGo);
    }

    cloak(location: string) {
        return {
            aboutBlank: () => {
                const win = window.open();
                if (!win) return;
                window.location.replace(location);
                const iframe = win.document.createElement("iframe") as HTMLIFrameElement;
                win.document.body.setAttribute('style', 'margin: 0; height: 100vh; width: 100%;');
                iframe.setAttribute('style', 'border: none; width: 100%; height: 100%; margin: 0;');
                iframe.src = window.location.href;
                win.document.body.appendChild(iframe);
            },
            blob: () => {
                const win = window.open();
                if (!win) return;
                window.location.replace(location);
                const content = `
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <style type="text/css">
                                body, html {
                                    margin: 0;
                                    padding: 0;
                                    height: 100%;
                                    width: 100%;
                                    overflow: hidden;
                                }
                            </style>
                        </head>
                        <body>
                            <iframe style="border: none; width: 100%; height: 100%;" src="${window.location.href}"></iframe>
                        </body>
                    </html>
                `;
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                win.location.href = url;
            }
        }
    }

    adBlock(enabled?: boolean) {
        if (enabled === true || enabled === false) {
            this.#storageManager.setVal("adBlock", enabled.valueOf().toString());
        }
        else {
            this.#storageManager.setVal("adBlock", "true");
        }
    }

    async *#init() {
        yield this.theme(this.#storageManager.getVal("theme") || "default");
    }

    constructor() {
        this.#storageManager = new StoreManager("radius||settings");
        Settings.#instance.add(this);
        (async () => {
            for await (const _ of this.#init());
        })();
    }
}

export { Settings };
