import { Router } from "express"
import { ExtensionsRouter } from "./extensions/router"
import { CreateOrdoBackendServerParams } from "../types"

export const InternalRouter = ({ fsDriver, authorise, logger }: CreateOrdoBackendServerParams) =>
  Router().use("/extensions", ExtensionsRouter({ fsDriver, authorise, logger }))
