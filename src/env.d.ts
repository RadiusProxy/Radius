/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@titaniumnetwork-dev/ultraviolet/client" />

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}
interface SJOptions {
    prefix: string;
    globals?: {
        wrapfn: string;
        wrapthisfn: string;
        trysetfn: string;
        importfn: string;
        rewritefn: string;
        metafn: string;
        setrealmfn: string;
        pushsourcemapfn: string;
    };
    files: {
        wasm: string;
        all: string;
        sync: string;
    };
    flags?: {
        serviceworkers?: boolean;
        syncxhr?: boolean;
        naiiveRewriter?: boolean;
        strictRewrites?: boolean;
        rewriterLogs?: boolean;
        captureErrors?: boolean;
        cleanErrors?: boolean;
        scramitize?: boolean;
        sourcemaps?: boolean;
    };
    siteFlags?: {};
    codec?: {
        encode: string;
        decode: string;
    };
}

declare class ScramjetController {
    constructor(opts: SJOptions);
    init(): Promise<void>;
    encodeUrl(term: string): string;
}
