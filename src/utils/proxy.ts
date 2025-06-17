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
    #serviceWorker?: ServiceWorkerRegistration;
    #storageManager: StoreManager<"radius||settings">;
    static #instance = new Set();

    static *getInstance() {
        for (const val of SW.#instance.keys()) {
            yield val as SW;
        }
    }

    search(input: string, template: string) {
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
        const input = this.search(string, this.#storageManager.getVal("searchEngine"));
        return proxy === "uv"
            ? `${__uv$config.prefix}${__uv$config.encodeUrl!(input)}`
            : this.#scramjetController!.encodeUrl(input);
    }

    async setTransport(transport?: "epoxy" | "libcurl", get?: boolean) {
        console.log("Setting transport");
        const wispServer = (): string => {
            const wispServerVal = this.#storageManager.getVal("wispServer");
            if (this.#storageManager.getVal("adBlock") === "true") {
                return wispServerVal.replace("/wisp/", "/adblock/");
            }
            return wispServerVal;
        }
        if (get) return this.#storageManager.getVal("transport");
        this.#storageManager.setVal(
            "transport",
            transport || this.#storageManager.getVal("transport") || "epoxy"
        );
        switch (transport) {
            case "epoxy": {
                await this.#baremuxConn!.setTransport("/epoxy/index.mjs", [
                    { wisp: wispServer() }
                ]);
            }
            case "libcurl": {
                await this.#baremuxConn!.setTransport("/libcurl/index.mjs", [
                    { wisp: wispServer() }
                ]);
            }
            default: {
                await this.#baremuxConn!.setTransport("/epoxy/index.mjs", [
                    { wisp: wispServer() }
                ]);
            }
        }
    }

    async wispServer(wispServer?: string, set?: true) {
        console.log(wispServer?.replace("/wisp/", "/adblock/"));
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
                await this.#scramjetController.init();
                navigator.serviceWorker.ready.then(async (reg) => {
                    console.log("SW ready to go!");
                    this.#serviceWorker = reg;
                });
                navigator.serviceWorker.register("/sw.js", { scope: "/" });
            } else {
                throw new Error(
                    "Your browser is not supported! This website uses Service Workers heavily."
                );
            }
        });
    }
}

export { SW };
