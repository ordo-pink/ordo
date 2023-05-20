import type { Readable } from "stream"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "../../../constants"
import { SuccessResponse, ExceptionResponse } from "../../../response-code"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM } from "../../constants"
import { processStream } from "../../utils/encrypt-stream"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const createFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { createFile, getMetadata, setMetadata }, encrypters }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub

    // const contentLength = Number(req.headers["content-length"])

    let metadata = await getMetadata({ path, issuerId }).catch(() => null)

    const encrypt = encrypters[0]

    if (!metadata) {
      metadata = {}
    }

    if (!metadata.encryption) {
      metadata.encryption = encrypt.encryptionType
      await setMetadata({ path, issuerId, content: metadata })
    }

    const processEncryption = processStream(encrypt)

    createFile({ path, content: processEncryption(path, req) as Readable, issuerId })
      .then(removeUserIdFromPath(userId))
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      // .then(() => {
      //   if (contentLength === 0) return

      //   return getInternalValue(userId, "totalSize").then((total) =>
      //     setInternalValue(userId, "totalSize", total + contentLength),
      //   )
      // })
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send("{}"))
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
