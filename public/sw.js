importScripts(
    "/vu/uv.bundle.js", 
    "/vu/uv.config.js",
    "/marcs/scramjet.shared.js", 
    "/marcs/scramjet.worker.js"
);
importScripts(__uv$config.sw || "/vu/uv.sw.js");

const uv = new UVServiceWorker();
const sj = new ScramjetServiceWorker();

self.addEventListener("fetch", function (event) {
    event.respondWith(
        (async () => {
            await sj.loadConfig();
            if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
                return await uv.fetch(event);
            } 
            else if (sj.route(event)) {
                return await sj.fetch(event);
            }
            else {
                return await fetch(event.request);
            }
        })()
    );
});
