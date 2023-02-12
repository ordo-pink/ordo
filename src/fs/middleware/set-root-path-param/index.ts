import type { RequestHandler } from "express"
import { PATH_PARAM } from "../../constants"
import { OrdoDirectoryPathParams } from "../../types"

export const setRootPathParam: RequestHandler<OrdoDirectoryPathParams> = (req, _, next) => {
  req.params[PATH_PARAM] = "/"

  req.params.logger.info(`Forced root path: ${req.params[PATH_PARAM]}`)

  next()
}
