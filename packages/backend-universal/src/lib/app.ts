import { urlencoded } from "body-parser"
import cors from "cors"
import express from "express"
import { FSRouter } from "./fs/router"
import { InternalRouter } from "./internal/router"
import { CreateOrdoBackendServerParams } from "./types"

const app = express()

export const createOrdoBackendServer = ({
  fsDriver,
  prependMiddleware = (app) => app,
  corsOptions,
  authorise,
  logger,
  limits,
  encrypt,
}: CreateOrdoBackendServerParams) =>
  prependMiddleware(app)
    .use(cors(corsOptions))
    .use(urlencoded({ extended: false }))
    .use("/fs", FSRouter({ fsDriver, authorise, logger, limits, encrypt }))
    .use("/internal", InternalRouter({ fsDriver, authorise, logger, limits, encrypt }))
    .disable("x-powered-by")
