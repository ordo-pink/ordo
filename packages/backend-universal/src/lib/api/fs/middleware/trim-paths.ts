import { FilePath, DirectoryPath } from "@ordo-pink/common-types"
import { RequestHandler } from "express"
import { OrdoDirectoryPathParams, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM } from "../constants"

export const trimPath: RequestHandler<OrdoDirectoryPathParams | OrdoFilePathParams> = (
  req,
  _,
  next,
) => {
  req.params[PATH_PARAM] = req.params[PATH_PARAM].trim() as FilePath | DirectoryPath

  next()
}
