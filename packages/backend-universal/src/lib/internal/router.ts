import { Router } from "express"
import { ExtensionsRouter } from "./extensions/router"
import { CreateOrdoBackendServerParams } from "../types"

export const InternalRouter = (params: CreateOrdoBackendServerParams) =>
  Router().use("/extensions", ExtensionsRouter(params))
