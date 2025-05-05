import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";

//@ts-ignore this is created at runtime. No types associated w/it
import { handler as astroHandler } from "../dist/server/entry.mjs";

const app = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true
});

await app.register(fastifyStatic, {
    root: fileURLToPath(new URL("../dist/client", import.meta.url))
});

await app.register(fastifyMiddie);

await app.use(astroHandler);

const port = parseInt(process.env.PORT as string) || parseInt("8080");

app.listen({ port: port, host: "0.0.0.0" }).then(async () => {
    console.log(`Server listening on http://localhost:${port}/`);
    console.log(`Server also listening on http://0.0.0.0:${port}/`);
});
