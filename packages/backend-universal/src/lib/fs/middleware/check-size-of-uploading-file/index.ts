import { ExceptionResponse } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { USER_ID_PARAM } from "../../constants"

export const checkSizeOfUploadingFile: FsRequestHandler<OrdoFilePathParams> =
  ({ internal }) =>
  async (req, res, next) => {
    const userId = req.params[USER_ID_PARAM]

    const contentSize = Number(req.headers["content-length"])

    const maxFileSizeMB = await internal.getInternalValue(userId, "maxUploadSize")
    const maxFileSize = maxFileSizeMB * 1024 * 1024

    const maxTotalSizeMB = await internal.getInternalValue(userId, "maxTotalSize")
    const maxTotalSize = maxTotalSizeMB * 1024 * 1024

    const totalSize = await internal.getInternalValue(userId, "totalSize")

    if (Number.isNaN(contentSize)) {
      req.params.logger.warn(`Content-Size header not specified`)
      return void res.status(ExceptionResponse.LENGTH_REQUIRED).send()
    }

    if (contentSize > maxFileSize) {
      req.params.logger.warn(
        `File too large: ${OrdoFile.getReadableSize(contentSize)} out of allowed ${maxFileSize}MB`,
      )
      return void res.status(ExceptionResponse.PAYLOAD_TOO_LARGE).send()
    }

    if (totalSize + contentSize > maxTotalSize) {
      req.params.logger.warn(
        `Insufficient space: ${OrdoFile.getReadableSize(contentSize)} with ${
          maxFileSize - totalSize
        }MB free space left`,
      )
      return void res.status(ExceptionResponse.UNPROCESSABLE_ENTITY).send()
    }

    return next()
  }
