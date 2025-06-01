import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { StoreManager } from "./storage";

const createScript = (src: string, defer?: boolean) => {
    const script = document.createElement("script") as HTMLScriptElement;
    script.src = src;
    if (defer) script.defer = defer;
    return document.body.appendChild(script);
};

/**
 * This class automatically sets up and handles lots of stuff for us.
 *
 * It registers/fixes errors with SW reg
 * It creates our bareMux worker
 * And other stuff.
 *
 * @example
 * import { SW } from "@utils/proxy.ts";
 * const handler = new SW();
 * //Consume the methods
 * // Or if an instance is already running
 * import { SW } from "@utils/proxy.ts";
 * const handler = SW.getInstance();
 * //Consume the methods
 */
class SW {
    #baremuxConn?: BareMuxConnection;
    #scramjetController?: ScramjetController;
    #serviceWorker_?: ServiceWorkerRegistration; // Renamed to avoid conflict, but marked as unused
    #storageManager: StoreManager<"radius||settings">;
    static #instance = new Set();

    static *getInstance() {
        for (const val of SW.#instance.keys()) {
            yield val as SW;
        }
    }

    #search(input: string, template: string) {
        try {
            return new URL(input).toString();
        } catch (_) {}

        try {
            const url = new URL(`http://${input}`);
            if (url.hostname.includes(".")) return url.toString();
        } catch (_) {}

        return template.replace("%s", encodeURIComponent(input));
    }

    encodeURL(string: string): string {
        const proxy = this.#storageManager.getVal("proxy") as "uv" | "sj";
        const input = this.#search(string, this.#storageManager.getVal("searchEngine"));
        return proxy === "uv"
            ? `${__uv$config.prefix}${__uv$config.encodeUrl!(input)}`
            : this.#scramjetController!.encodeUrl(input);
    }

    async setTransport(transport?: "epoxy" | "libcurl", get?: boolean) {
        console.log("Setting transport");
        if (get) return this.#storageManager.getVal("transport");
        this.#storageManager.setVal(
            "transport",
            transport || this.#storageManager.getVal("transport") || "epoxy"
        );
        switch (transport) {
            case "epoxy": {
                await this.#baremuxConn!.setTransport("/epoxy/index.mjs", [
                    { wisp: this.#storageManager.getVal("wispServer") }
                ]);
            }
            case "libcurl": {
                await this.#baremuxConn!.setTransport("/libcurl/index.mjs", [
                    { wisp: this.#storageManager.getVal("wispServer") }
                ]);
            }
            default: {
                await this.#baremuxConn!.setTransport("/epoxy/index.mjs", [
                    { wisp: this.#storageManager.getVal("wispServer") }
                ]);
            }
        }
    }

    async wispServer(wispServer?: string, set?: true) {
        this.#storageManager.setVal(
            "wispServer",
            wispServer ||
                this.#storageManager.getVal("wispServer") ||
                (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/"
        );
        if (set) await this.setTransport();
    }

    constructor() {
        SW.#instance.add(this);
        this.#storageManager = new StoreManager("radius||settings");
        const checkScripts = (): Promise<void> => {
            return new Promise((resolve) => {
                const t = setInterval(() => {
                    if (
                        typeof __uv$config !== "undefined" &&
                        typeof ScramjetController !== "undefined"
                    ) {
                        clearInterval(t);
                        resolve();
                    }
                });
            });
        };
        createScript("/vu/uv.bundle.js", true);
        createScript("/vu/uv.config.js", true);
        createScript("/marcs/scramjet.controller.js", true);

        checkScripts().then(async () => {
            this.#baremuxConn = new BareMuxConnection("/erab/worker.js");
            await this.setTransport();
            this.#scramjetController = new ScramjetController({
                prefix: "/~/scramjet/",
                files: {
                    wasm: "/marcs/scramjet.wasm.wasm",
                    worker: "/marcs/scramjet.worker.js",
                    client: "/marcs/scramjet.client.js",
                    shared: "/marcs/scramjet.shared.js",
                    sync: "/marcs/scramjet.sync.js"
                },
                flags: {
                    rewriterLogs: false
                }
            });
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/sw.js", {
                    scope: __uv$config.prefix
                }).then((reg) => {
                    this.#serviceWorker_ = reg;
                    console.log("SW Registered");
                }).catch((err) => {
                    console.error("Failed to register SW: ", err);
                });
            } else {
                console.error("Your browser doesn\'t support SWs");
            }
        });
    }
}

export { SW };
