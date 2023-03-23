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

const PORT = process.env.BACKEND_LOCAL_PORT
const TOKEN = process.env.BACKEND_LOCAL_TOKEN
const MAX_UPLOAD_SIZE = process.env.FREE_UPLOAD_SIZE
const MAX_TOTAL_SIZE = process.env.FREE_SPACE_LIMIT

const maxUploadSize = Number(MAX_UPLOAD_SIZE)
const maxTotalSize = Number(MAX_TOTAL_SIZE)

if (!existsSync(root)) mkdirSync(root, { recursive: true })

const server = createOrdoBackendServer({
  fsDriver: createFSDriver(root),
  authorise: createAuthorisationStub(TOKEN),
  prependMiddleware: (app) => app.use(morgan("dev")),
  logger: ConsoleLogger,
  limits: { maxTotalSize, maxUploadSize },
})

server.listen(PORT, () => ConsoleLogger.info(`🚀 Listening on port ${PORT}`))
