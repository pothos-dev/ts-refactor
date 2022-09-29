import fastify from "fastify"
import { getFilePaths } from "./lib/fs"
import cors from "@fastify/cors"

const app = fastify({ logger: true })

app.get("/files", async (request, reply) => {
  return getFilePaths()
})

const start = async () => {
  try {
    await app.register(cors)
    await app.listen({ port: 8080 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
