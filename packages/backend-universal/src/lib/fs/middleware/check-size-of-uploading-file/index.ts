import { ExceptionResponse } from "@ordo-pink/common-types"
import type { RequestHandler } from "express"
import { OrdoFilePathParams } from "../../../types"

export const checkSizeOfUploadingFile: RequestHandler<OrdoFilePathParams> = (req, res, next) => {
  const contentSize = Number(req.headers["content-length"])
  const fiveMB = 5 * 1024 * 1024

  if (Number.isNaN(contentSize) || contentSize >= fiveMB) {
    return void res.status(ExceptionResponse.BAD_REQUEST).send("File too large")
  }

  return next()
}
