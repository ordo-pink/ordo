import { ExceptionResponse, SuccessResponse, SystemDirectory } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler } from "../../../fs"
import { USER_ID_PARAM } from "../../../fs/constants"
import { removeUserIdFromPath } from "../../../fs/utils/remove-user-id-from-path"
import { ExtensionsParams } from "../types"

export const createExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { createFile } }) =>
  (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

    createFile({ path, content: req })
      .then(removeUserIdFromPath(userId))
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
