import type { RequestHandler } from "express"
import { OrdoDirectoryPathParams } from "../../types"

export const setRootPathParam: RequestHandler<OrdoDirectoryPathParams> = (req, _, next) => {
  req.params.path = "/"

  next()
}
