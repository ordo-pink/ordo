import { urlencoded } from "body-parser"
import cors from "cors"
import express from "express"
import { FSRouter } from "./api/fs/router"
import { CreateOrdoBackendServerParams } from "./types"

const app = express()

export const createOrdoBackendServer = ({
  fileDriver: fsDriver,
  prependMiddleware = (app) => app,
  corsOptions,
  authorise,
  logger,
  encrypters,
}: CreateOrdoBackendServerParams) =>
  prependMiddleware(app)
    .use(cors(corsOptions))
    .use(urlencoded({ extended: false }))
    .use("/fs", FSRouter({ fileDriver: fsDriver, authorise, logger, encrypters }))
    .disable("x-powered-by")
