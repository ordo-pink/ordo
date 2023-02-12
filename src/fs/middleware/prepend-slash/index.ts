import { RequestHandler } from "express"
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM } from "../../constants"
import {
  OrdoDirectoryPathParams,
  OrdoDirectoryTwoPathsParams,
  OrdoFilePathParams,
  OrdoFileTwoPathsParams,
} from "../../types"

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

export const prependOldPathAndNewPathSlashes: RequestHandler<
  OrdoDirectoryTwoPathsParams | OrdoFileTwoPathsParams
> = (req, _, next) => {
  if (!req.params[OLD_PATH_PARAM].startsWith("/")) {
    req.params[OLD_PATH_PARAM] = `/${req.params[OLD_PATH_PARAM]}`
  }

  if (!req.params[NEW_PATH_PARAM].startsWith("/")) {
    req.params[NEW_PATH_PARAM] = `/${req.params[NEW_PATH_PARAM]}`
  }

  next()
}
