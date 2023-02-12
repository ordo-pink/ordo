import { urlencoded } from "body-parser"
import cors from "cors"
import express from "express"
import { FSRouter } from "./fs/router"
import { CreateOrdoBackendServerParams } from "./types"

const app = express()

export const createOrdoBackendServer = ({
  drivers,
  prependMiddleware = (app) => app,
  corsOptions,
  authorize,
  logger,
}: CreateOrdoBackendServerParams) =>
  prependMiddleware(app)
    .use(cors(corsOptions))
    .use(urlencoded({ extended: false }))
    .use(`/fs`, FSRouter({ drivers, authorize, logger }))
    .disable("x-powered-by")
