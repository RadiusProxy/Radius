import { defineConfig } from 'astro/config';
import type { Plugin } from 'vite';
import wisp from "wisp-server-node";
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";

const viteWispServer = (): Plugin => {
    return {
        name: 'vite-wisp-server',
        configureServer(server) {
            server.httpServer?.on('upgrade', (req, socket, head) => {
                console.log('3');
                req.url.startsWith('/wisp') ? wisp.routeRequest(req, socket, head) : undefined 
            })
        }
    }
};

export default defineConfig({
    vite: {
        plugins: [
            tailwindcss(),
            viteWispServer()
        ]
    },
    integrations: [icon()],
    output: 'server',
    adapter: node({
        mode: 'middleware'
    })
});
