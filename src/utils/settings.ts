import { StoreManager } from "./storage";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { SW } from "@utils/proxy.ts";
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
        function *get() {
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
            })
        } 

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
        this.#storageManager.setVal('theme', theme || this.#storageManager.getVal('theme'));
        theme === 'default' 
            ? document.documentElement.className = '' 
            : document.documentElement.className = theme || this.#storageManager.getVal('theme');
    }
 
    async *#init() {
        yield this.theme(this.#storageManager.getVal('theme') || 'default');
    }

    constructor() {
        this.#storageManager = new StoreManager("radius||settings");
        Settings.#instance.add(this);
        (async() => {
            for await (const _ of this.#init()); 
        })();
    }
}

export { Settings }
