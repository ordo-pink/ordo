import { OrdoFilePath, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { RequestHandler } from "express"
import {
  OrdoDirectoryPathParams,
  OrdoFilePathParams,
  OrdoDirectoryTwoPathsParams,
  OrdoFileTwoPathsParams,
} from "../../types"
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM } from "../constants"

export const trimPath: RequestHandler<OrdoDirectoryPathParams | OrdoFilePathParams> = (
  req,
  _,
  next,
) => {
  req.params[PATH_PARAM] = req.params[PATH_PARAM].trim() as OrdoFilePath | OrdoDirectoryPath

  next()
}

export const trimOldPathAndNewPath: RequestHandler<
  OrdoDirectoryTwoPathsParams | OrdoFileTwoPathsParams
> = (req, _, next) => {
  req.params[OLD_PATH_PARAM] = req.params[OLD_PATH_PARAM].trim() as OrdoFilePath | OrdoDirectoryPath
  req.params[NEW_PATH_PARAM] = req.params[NEW_PATH_PARAM].trim() as OrdoFilePath | OrdoDirectoryPath

  next()
}
