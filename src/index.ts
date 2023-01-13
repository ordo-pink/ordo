import "module-alias/register"

import { join } from "path"

import { createOrdoBackendServer } from "./app"
import { OrdoDirectoryPath } from "$core/types"
import { createDefaultFSDriver } from "$fs/driver"

const PORT = process.env.ORDO_BACKEND_UNIVERSAL_PORT ?? 1337
const DIRECTORY = process.env.ORDO_BACKEND_UNIVERSAL_DIRECTORY ?? join(__dirname, "files")

const dir = DIRECTORY.endsWith("/") ? DIRECTORY : `${DIRECTORY}/`

const fsDriver = createDefaultFSDriver(dir as OrdoDirectoryPath)

const server = createOrdoBackendServer({ fsDriver })

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`),
)
// export * from "$core/either"
// export * from "$core/types"
// export * from "$fs/constants"
// export * from "$fs/driver"
// export * from "$fs/router"
// export * from "./app"
