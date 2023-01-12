import "module-alias/register"

import { createOrdoBackendServer } from "./app"
import { fsDriver } from "$fs/driver"

const PORT = process.env.ORDO_BACKEND_UNIVERSAL_PORT ?? 1337

const server = createOrdoBackendServer({ fsDriver })

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`),
)
