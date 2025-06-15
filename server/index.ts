import Fastify, {
    FastifyReply,
    FastifyRequest,
    FastifyServerFactory,
    FastifyServerFactoryHandler,
    RawServerDefault
} from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import wisp from "wisp-server-node";

//@ts-ignore this is created at runtime. No types associated w/it
import { handler as astroHandler } from "../dist/server/entry.mjs";
import { createServer } from "node:http";
import { Socket } from "node:net";

const serverFactory: FastifyServerFactory = (
    handler: FastifyServerFactoryHandler
): RawServerDefault => {
    return createServer()
        .on("request", (req, res) => {
            handler(req, res);
        })
        .on("upgrade", (req, socket, head) => {
            if (req.url?.endsWith("/wisp/") || req.url?.endsWith("/adblock/")) {
                console.log(req.url);
                wisp.routeRequest(req, socket as Socket, head);
            }
        });
};

const app = Fastify({
    logger: false,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    serverFactory: serverFactory
});

await app.register(fastifyStatic, {
    root: fileURLToPath(new URL("../dist/client", import.meta.url))
});

await app.register(fastifyMiddie);

await app.use(astroHandler);

app.setNotFoundHandler((req, res) => {
    res.redirect('/404'); // This is hacky as hell
});

const port = parseInt(process.env.PORT as string) || parseInt("8080");

app.listen({ port: port, host: "0.0.0.0" }).then(async () => {
    console.log(`Server listening on http://localhost:${port}/`);
    console.log(`Server also listening on http://0.0.0.0:${port}/`);
});
