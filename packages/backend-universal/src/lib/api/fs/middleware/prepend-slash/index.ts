import { RequestHandler } from "express"
import { OrdoDirectoryPathParams, OrdoFilePathParams } from "../../../../types"
import { PATH_PARAM } from "../../constants"

export const prependPathSlash: RequestHandler<OrdoDirectoryPathParams | OrdoFilePathParams> = (
  req,
  _,
  next,
) => {
  if (!req.params[PATH_PARAM].startsWith("/")) {
    req.params[PATH_PARAM] = `/${req.params[PATH_PARAM]}`
  }

  next()
}
