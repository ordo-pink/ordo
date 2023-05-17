import { RequestHandler } from "express"
import { OrdoDirectoryPathParams } from "../../../../types"
import { PATH_PARAM } from "../../constants"

export const appendTrailingDirectoryPathSlash: RequestHandler<OrdoDirectoryPathParams> = (
  req,
  _,
  next,
) => {
  if (!req.params[PATH_PARAM].endsWith("/")) {
    req.params[PATH_PARAM] = `${req.params[PATH_PARAM]}/`
  }

  next()
}
