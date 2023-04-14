import { ExceptionResponse } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { TOKEN_PARSED_PARAM, USER_ID_PARAM } from "../../constants"

export const checkSizeOfUploadingFile: FsRequestHandler<OrdoFilePathParams> =
  ({ internal }) =>
  async (req, res, next) => {
    const userId = req.params[USER_ID_PARAM]

    const contentSize = Number(req.headers["content-length"])
    const subscription = req.params[TOKEN_PARSED_PARAM].subscription

    const maxFileSizeMB = subscription ? subscription.maxFileSize : 50
    const maxFileSize = maxFileSizeMB * 1024 * 1024

    const maxTotalSizeMB = subscription ? subscription.maxUploadSize : 5
    const maxTotalSize = maxTotalSizeMB * 1024 * 1024

    const totalSize = await internal.getInternalValue(userId, "totalSize")

    req.params.logger.info(maxFileSize, maxTotalSize, contentSize, totalSize)

    if (Number.isNaN(contentSize)) {
      req.params.logger.warn(`Content-Size header not specified`)
      return void res.status(ExceptionResponse.LENGTH_REQUIRED).send("{}")
    }

    if (contentSize > maxFileSize) {
      req.params.logger.warn(
        `File too large: ${OrdoFile.getReadableSize(
          contentSize,
        )} out of allowed ${maxFileSizeMB}MB`,
      )
      return void res.status(ExceptionResponse.PAYLOAD_TOO_LARGE).send("{}")
    }

    if (totalSize + contentSize > maxTotalSize) {
      req.params.logger.warn(
        `Insufficient space: ${OrdoFile.getReadableSize(contentSize)} with ${
          maxFileSize - totalSize
        } free space left`,
      )
      return void res.status(ExceptionResponse.UNPROCESSABLE_ENTITY).send("{}")
    }

    return next()
  }
