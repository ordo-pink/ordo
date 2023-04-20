import { ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM, TOKEN_PARSED_PARAM } from "../../constants"
import { ENCRYPT_ACTION, processStream } from "../../utils/encrypt-stream"

export const getFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { getFileContentStream, getMetadata }, encrypt }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub

    let encryption = false

    try {
      const metadata = await getMetadata({ path, issuerId }).catch(() => null)
      encryption = metadata && metadata.encryption && metadata.encryption === "v1"
    } catch (_) {
      req.params.logger.debug("Metadata not found")
    }

    const processEncryption = processStream(encrypt)

    getFileContentStream({ path, issuerId })
      .then((content) =>
        encryption
          ? processEncryption(path, content, res, ENCRYPT_ACTION.DECRYPT)
          : content.pipe(res),
      )
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () =>
            res.status(ExceptionResponse.NOT_FOUND).send("{}"),
          )
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
