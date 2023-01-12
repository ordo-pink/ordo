import "module-alias/register"

import { resolve } from "path"

import { createOrdoBackendServer } from "./app"
import { DirectoryPath } from "$core/types"
import { createFsServer } from "$fs/driver"

const PORT = process.env.ORDO_BACKEND_UNIVERSAL_PORT ?? 1337
const DIRECTORY = process.env.ORDO_BACKEND_UNIVERSAL_DIRECTORY ?? resolve("./files")

if (!DIRECTORY.startsWith("/")) {
  throw new Error("ORDO_BACKEND_UNIVERSAL_DIRECTORY must have absolute path.")
}

const dir = DIRECTORY.endsWith("/") ? DIRECTORY : `${DIRECTORY}/`

const fsDriver = createFsServer(dir as DirectoryPath)

const server = createOrdoBackendServer({ fsDriver })

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`),
)
