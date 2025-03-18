import { StoreManager } from "./storage";

class Settings {
    #storageManager: StoreManager<"radius||settings">;
    static #instance = new Set(); 

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

    theme(theme: string) {
        this.#storageManager.setVal('theme', theme);
        theme === 'default' 
            ? document.documentElement.className = '' 
            : document.documentElement.className = theme;
    }

    async *#init() {
        yield this.theme(this.#storageManager.getVal('theme'));
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
