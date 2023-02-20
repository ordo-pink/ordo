import { SystemDirectory, SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../fs/constants"
import { removeUserIdFromPath } from "../../../fs/utils/remove-user-id-from-path"
import { FsRequestHandler } from "../../../types"
import { ExtensionsParams } from "../../../types"

export const createExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { createFile }, internal: { getInternalValue, setInternalValue } }) =>
  (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

    const contentLength = Number(req.headers["content-length"])

    createFile({ path, content: req })
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
