import { existsSync, mkdirSync } from "fs"
import { join } from "path"
import { createAuthorisationStub } from "@ordo-pink/backend-authorisation-stub"
import { createFSDriver } from "@ordo-pink/backend-fs-driver"
import { createOrdoBackendServer } from "@ordo-pink/backend-universal"
import { ConsoleLogger } from "@ordo-pink/logger"
import morgan from "morgan"

/**
 * Points to a directory next to the Ordo.pink monorepo. Just for the sake of
 * not loosing the data if you accidentally drop the `dist`.
 */
const root = join(__dirname, "..", "..", "..", "..", "ordo-backend-local-assets")

const PORT = process.env.VITE_BACKEND_LOCAL_PORT
const TOKEN = process.env.VITE_BACKEND_LOCAL_TOKEN

const assetsPath = join(root, TOKEN)

if (!existsSync(assetsPath)) mkdirSync(assetsPath, { recursive: true })

const server = createOrdoBackendServer({
  fsDriver: createFSDriver(root),
  authorise: createAuthorisationStub(TOKEN),
  prependMiddleware: (app) => app.use(morgan("dev")),
  logger: ConsoleLogger,
})

server.listen(PORT, () => console.log("Listening on port ", PORT))
