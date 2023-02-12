import { OrdoFile } from "@ordo-pink/core"
import type { RequestHandler } from "express"
import { contentType } from "mime-types"
import { PATH_PARAM } from "../../constants"
import { OrdoDirectoryPathParams, OrdoFilePathParams } from "../../types"

export const setContentTypeHeader: RequestHandler<OrdoFilePathParams | OrdoDirectoryPathParams> = (
  req,
  res,
  next,
) => {
  const path = req.params[PATH_PARAM]

  const extension = OrdoFile.getFileExtension(path)

  const type = contentType(extension) || "application/octet-stream"

  res.setHeader("content-type", type)

  req.params.logger.info(`Set content type: ${type}`)

  next()
}
