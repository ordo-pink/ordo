import { OrdoFile } from "@ordo-pink/fs-entity"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "../../../../constants"
import { ExceptionResponse } from "../../../../response-code"
import { FsRequestHandler, OrdoFilePathParams } from "../../../../types"

export const checkSizeOfUploadingFile: FsRequestHandler<OrdoFilePathParams> =
  ({ fileService: file }) =>
  async (req, res, next) => {
    const userId = req.params[USER_ID_PARAM]

    const contentSize = Number(req.headers["content-length"])
    const subscription = req.params[TOKEN_PARSED_PARAM].subscription

    const maxFileSizeMB = subscription ? subscription.maxFileSize : 5
    const maxFileSize = maxFileSizeMB * 1024 * 1024

    const maxTotalSizeMB = subscription ? subscription.maxUploadSize : 50
    const maxTotalSize = maxTotalSizeMB * 1024 * 1024

    const totalSize = await file.getTotalSize(userId)

    const readableMaxFileSize = OrdoFile.toReadableSize(maxFileSize)
    const readableContentSize = OrdoFile.toReadableSize(contentSize)
    const readableInsufficientSpace = OrdoFile.toReadableSize(
      Math.floor((maxFileSize - totalSize) / 1024 / 1024),
    )

    if (Number.isNaN(contentSize)) {
      req.params.logger.warn(`Content-Size header not specified`)
      return res.status(ExceptionResponse.LENGTH_REQUIRED).send("{}")
    }

    if (contentSize > maxFileSize) {
      req.params.logger.warn(
        `File too large: ${readableContentSize} out of allowed ${readableMaxFileSize}`,
      )
      return res.status(ExceptionResponse.PAYLOAD_TOO_LARGE).send("{}")
    }

    if (totalSize + contentSize > maxTotalSize) {
      req.params.logger.warn(
        `Insufficient space: ${readableContentSize} with ${readableInsufficientSpace} free space left`,
      )
      return res.status(ExceptionResponse.UNPROCESSABLE_ENTITY).send("{}")
    }

    return next()
  }
