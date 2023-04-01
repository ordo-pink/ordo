import type { Readable } from "stream"
import { SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { processStream } from "../../utils/encrypt-stream"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const createFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { createFile }, internal: { getInternalValue, setInternalValue } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    const contentLength = Number(req.headers["content-length"])

    createFile({ path, content: processStream(path, req) as Readable })
      .then(removeUserIdFromPath(userId))
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      .then(() => {
        if (contentLength === 0) return

        return getInternalValue(userId, "totalSize").then((total) =>
          setInternalValue(userId, "totalSize", total + contentLength),
        )
      })
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
