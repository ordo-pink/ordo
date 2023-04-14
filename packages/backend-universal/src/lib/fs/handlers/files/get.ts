import { ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM } from "../../constants"
import { ENCRYPT_ACTION, processStream } from "../../utils/encrypt-stream"

export const getFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { getFileContent }, encrypt }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const processEncryption = processStream(encrypt)

    getFileContent(path)
      .then((content) => processEncryption(path, content, res, ENCRYPT_ACTION.DECRYPT))
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
