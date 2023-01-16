import "module-alias/register"

import { join } from "path"

import { createOrdoBackendServer } from "./app"
import { OrdoDirectoryPath } from "$core/types"
import { createDefaultFSDriver } from "$fs/driver"
import { createDefaultUserDriver } from "$user/driver"

const PORT = process.env.ORDO_BACKEND_UNIVERSAL_PORT ?? 5000
const DIRECTORY = process.env.ORDO_BACKEND_UNIVERSAL_DIRECTORY ?? join(__dirname, "files")
const TOKEN = process.env.ORDO_BACKEND_UNIVERSAL_TOKEN ?? "WHOA_SO_SAFE!"

const dir = DIRECTORY.endsWith("/") ? DIRECTORY : `${DIRECTORY}/`

const fsDriver = createDefaultFSDriver(dir as OrdoDirectoryPath)
const userDriver = createDefaultUserDriver(TOKEN)

const server = createOrdoBackendServer({ fsDriver, userDriver })

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
