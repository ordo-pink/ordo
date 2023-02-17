import { urlencoded } from "body-parser"
import cors from "cors"
import express from "express"
import { FSRouter } from "./fs/router"
import { ExtensionsRouter } from "./internal/extensions/router"
import { CreateOrdoBackendServerParams } from "./types"

const app = express()

export const createOrdoBackendServer = ({
  fsDriver,
  prependMiddleware = (app) => app,
  corsOptions,
  authorize,
  logger,
}: CreateOrdoBackendServerParams) =>
  prependMiddleware(app)
    .use(cors(corsOptions))
    .use(urlencoded({ extended: false }))
    .use("/fs", FSRouter({ fsDriver, authorize, logger }))
    .use("/extensions", ExtensionsRouter({ fsDriver, authorize, logger }))
    .disable("x-powered-by")
