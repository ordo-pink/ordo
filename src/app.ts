import { urlencoded } from "body-parser"
import compression from "compression"
import cors from "cors"
import express, { Request } from "express"

import { Drivers } from "$core/types"

import fsRouter from "$fs/router"
import userRouter from "$user/router"

const app = express()

const filterCompression = (req: Request) => !req.headers["x-no-compression"]

export const createOrdoBackendServer = (drivers: Drivers) =>
  app
    .use(cors())
    .use(urlencoded({ extended: false }))
    .use(compression({ filter: filterCompression }))
    .use("/fs", fsRouter(drivers))
    .use("/user", userRouter(drivers))
    .disable("x-powered-by")
