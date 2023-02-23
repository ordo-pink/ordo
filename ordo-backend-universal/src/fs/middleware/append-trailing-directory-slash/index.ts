import { RequestHandler } from "express"
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM } from "../../constants"
import { OrdoDirectoryPathParams, OrdoDirectoryTwoPathsParams } from "../../types"

export const appendTrailingDirectoryPathSlash: RequestHandler<OrdoDirectoryPathParams> = (
  req,
  _,
  next,
) => {
  if (!req.params[PATH_PARAM].endsWith("/")) {
    req.params[PATH_PARAM] = `${req.params[PATH_PARAM]}/`
    req.params.logger.info(`Appended trailing slash: ${req.params[PATH_PARAM]}`)
  }

  next()
}

export const appendTrailingDirectoryOldPathAndNewPathSlashes: RequestHandler<
  OrdoDirectoryTwoPathsParams
> = (req, _, next) => {
  if (!req.params[OLD_PATH_PARAM].endsWith("/")) {
    req.params[OLD_PATH_PARAM] = `${req.params[OLD_PATH_PARAM]}/`
    req.params.logger.info(`Appended trailing slash: ${req.params[OLD_PATH_PARAM]}`)
  }

  if (!req.params[NEW_PATH_PARAM].endsWith("/")) {
    req.params[NEW_PATH_PARAM] = `${req.params[NEW_PATH_PARAM]}/`
    req.params.logger.info(`Appended trailing slash: ${req.params[NEW_PATH_PARAM]}`)
  }

  next()
}
