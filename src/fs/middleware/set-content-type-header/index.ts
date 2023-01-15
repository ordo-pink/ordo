import type { RequestHandler } from "express"
import { contentType } from "mime-types"

import { OrdoFilePath } from "$core/types"

import { PATH_PARAM } from "$fs/constants"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const setContentTypeHeader: RequestHandler<Params> = (req, res, next) => {
  const path = req.params[PATH_PARAM]

  const extension = getFileExtension(path)

  const type = contentType(extension) || "application/octet-stream"

  res.setHeader("content-type", type)

  next()
}
