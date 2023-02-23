import { RequestHandler } from "express"
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM, USER_ID_PARAM } from "../../constants"
import {
  OrdoDirectoryPathParams,
  OrdoDirectoryTwoPathsParams,
  OrdoFilePathParams,
  OrdoFileTwoPathsParams,
} from "../../types"

export const addUserIdToPath: RequestHandler<OrdoDirectoryPathParams | OrdoFilePathParams> = (
  req,
  _,
  next,
) => {
  req.params[PATH_PARAM] = `/${req.params[USER_ID_PARAM]}${req.params[PATH_PARAM]}`

  req.params.logger.info("Appended userId to path")

  next()
}

export const addUserIdToOldPathAndNewPath: RequestHandler<
  OrdoDirectoryTwoPathsParams | OrdoFileTwoPathsParams
> = (req, _, next) => {
  req.params[OLD_PATH_PARAM] = `/${req.params[USER_ID_PARAM]}${req.params[OLD_PATH_PARAM]}`
  req.params[NEW_PATH_PARAM] = `/${req.params[USER_ID_PARAM]}${req.params[NEW_PATH_PARAM]}`

  req.params.logger.info("Appended userId to old path and new path")

  next()
}
