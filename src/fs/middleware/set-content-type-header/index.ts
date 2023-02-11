import { OrdoFilePath, OrdoFile } from "@ordo-pink/core"
import type { RequestHandler } from "express"
import { contentType } from "mime-types"
import { PATH_PARAM } from "../../constants"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const setContentTypeHeader: RequestHandler<Params> = (req, res, next) => {
  const path = req.params[PATH_PARAM]

  const extension = OrdoFile.getFileExtension(path)

  const type = contentType(extension) || "application/octet-stream"

  res.setHeader("content-type", type)

  next()
}
