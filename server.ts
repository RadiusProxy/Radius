/**
 * thnaks proudparrot2
 */

import { copyFile, mkdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { Socket } from 'node:net'
// @ts-expect-error
import { server as wisp } from '@mercuryworkshop/wisp-js/server'
import { consola } from 'consola'
import next from 'next'
import { rimraf } from 'rimraf'
import { config } from 'dotenv'
config()

const environment =
  process.env.NODE_ENV !== 'production' ? 'development' : 'production'
const port = Number.parseInt(process.env.PORT as string) || 3000

const server = createServer()
const app = next({
  dev: environment === 'development',
  port,
  hostname: 'localhost'
})

await rimraf('public/files')
await mkdir('public/files')
await copyFile(
  'node_modules/@mercuryworkshop/epoxy-transport/dist/index.mjs',
  'public/files/epoxy.js'
)
await copyFile(
  'node_modules/@mercuryworkshop/bare-mux/dist/worker.js',
  'public/files/bare-mux-worker.js'
)

consola.start(`Starting ${environment} server...`)
await app.prepare()

const requestHandler = app.getRequestHandler()
const upgradeHandler = app.getUpgradeHandler()

server.on('request', requestHandler)
server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/wisp/')) {
    wisp.routeRequest(req, socket as Socket, head)
  }

  upgradeHandler(req, socket, head)
})

server.listen(port, () => {
  consola.success(`Ready on http://localhost:${port}`)
})