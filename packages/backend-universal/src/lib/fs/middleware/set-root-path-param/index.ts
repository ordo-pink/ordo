import type { RequestHandler } from "express"
import { OrdoDirectoryPathParams } from "../../../types"
import { PATH_PARAM } from "../../constants"

export const setRootPathParam: RequestHandler<OrdoDirectoryPathParams> = (req, _, next) => {
  req.params[PATH_PARAM] = "/"

  next()
}
