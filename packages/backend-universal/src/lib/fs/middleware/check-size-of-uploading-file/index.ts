import { ExceptionResponse } from "@ordo-pink/common-types"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { USER_ID_PARAM } from "../../constants"

export const checkSizeOfUploadingFile: FsRequestHandler<OrdoFilePathParams> =
  ({ internal }) =>
  async (req, res, next) => {
    const userId = req.params[USER_ID_PARAM]

    req.params.logger.info("HELLLOs")

    const contentSize = Number(req.headers["content-length"])

    const maxFileSizeMB = await internal.getInternalValue(userId, "maxUploadSize")
    const maxFileSize = maxFileSizeMB * 1024 * 1024

    const maxTotalSizeMB = await internal.getInternalValue(userId, "maxTotalSize")
    const maxTotalSize = maxTotalSizeMB * 1024 * 1024

    const totalSize = await internal.getInternalValue(userId, "totalSize")

    req.params.logger.info(`Attempting to upload ${contentSize} file`)

    if (Number.isNaN(contentSize)) {
      return void res.status(ExceptionResponse.LENGTH_REQUIRED).send()
    }

    if (contentSize > maxFileSize) {
      return void res.status(ExceptionResponse.PAYLOAD_TOO_LARGE).send()
    }

    if (totalSize + contentSize > maxTotalSize) {
      return void res.status(ExceptionResponse.UNPROCESSABLE_ENTITY).send()
    }

    return next()
  }
