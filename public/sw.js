// Example: aero with other proxies in a SW switcher design

// Constants
/**
 * @type {string}
 */
const dirToAeroConfig = "/aero/";
/**
 * @type {string}
 */
const dirToUvConfigAndBundle = "/uv/";

importScripts(`${dirToAeroConfig}config.aero.js`);
importScripts(aeroConfig.bundle["bare-mux"]);
importScripts(aeroConfig.bundle.handle);

importScripts(`${dirToUvConfigAndBundle}uv.bundle.js`);
importScripts(`${dirToUvConfigAndBundle}uv.config.js`);
importScripts(__uv$config.sw);

importScripts(`${dirToAeroConfig}/extras/aeroHandleSimple.js`);

const aeroHandlerWithExtras = patchAeroHandler(handle);
const uv = new UVServiceWorker();

addEventListener("install", skipWaiting);

// Switching
let chosenProxy = defaultProxy;
addEventListener("message", event => {
	if ("type" in event.data && event.data.type === "changeDefault") {
		const possibleChosenProxy = event.data.data;
		if (isValidProxy(possibleChosenProxy))
			chosenProxy = possibleChosenProxy;
		else {
			console.log(
				`Fatal error: tried to set the default proxy, but the proxy to be set isn't supported: ${chosenProxy}`
			);
		}
	}
});

addEventListener("fetch", ev => {
	if (ev.request.url.startsWith(__uv$config.prefix))
		return ev.respondWith(uv.fetch(ev));
	if (routeAero(ev)) return ev.respondWith(aeroHandlerWithExtras(ev));
});

function isValidProxy(proxy) {
	return ["aero", "uv"].includes(proxy);
}
