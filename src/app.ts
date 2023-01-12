import { json, urlencoded } from "body-parser"
import express from "express"

import { Drivers } from "$core/types"

import fsRouter from "$fs/router"

const app = express()

export const createOrdoBackendServer = (drivers: Drivers) =>
  app
    .use(urlencoded({ extended: false }))
    .use(json())
    .use("/fs", fsRouter(drivers.fsDriver))
