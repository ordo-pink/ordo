import { existsSync, mkdirSync } from "fs"
import { join } from "path"
import { createAuthorisationStub } from "@ordo-pink/authorisation-stub"
import { createOrdoBackendServer } from "@ordo-pink/backend-universal"
import { createFSDriver } from "@ordo-pink/fs-driver"
import morgan from "morgan"

/**
 * Points to a directory next to the Ordo.pink monorepo. Just for the sake of
 * not loosing the data if you accidentally drop the `dist`.
 */
const root = join(__dirname, "..", "..", "..", "..", "ordo-backend-local-assets")

const PORT = process.env.LOCAL_BACKEND_PORT ?? 5000
const TOKEN = process.env.LOCAL_TOKEN ?? "BOOP"

const assetsPath = join(root, TOKEN)

if (!existsSync(assetsPath)) mkdirSync(assetsPath, { recursive: true })

const server = createOrdoBackendServer({
  fsDriver: createFSDriver(root),
  authorise: createAuthorisationStub("BOOP"),
  prependMiddleware: (app) => app.use(morgan("dev")),
  logger: {
    alert: console.log,
    critical: console.log,
    debug: console.log,
    error: console.log,
    info: console.log,
    notice: console.log,
    panic: console.log,
    warn: console.log,
  },
})

server.listen(PORT, () => console.log("Listening on port ", PORT))
