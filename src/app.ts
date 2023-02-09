import { urlencoded } from "body-parser"
import compression from "compression"
import cors from "cors"
import express, { Request } from "express"
import { FSRouter } from "./fs/router"
import { AppContext } from "./types"

const app = express()

const filterCompression = (req: Request) => !req.headers["x-no-compression"]

export const createOrdoBackendServer = (drivers: AppContext) =>
  app
    .use(cors())
    .use(urlencoded({ extended: false }))
    .use(compression({ filter: filterCompression }))
    .use(`/fs`, FSRouter(drivers))
    .disable("x-powered-by")
