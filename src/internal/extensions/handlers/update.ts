import { ExceptionResponse, SuccessResponse, SystemDirectory } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler } from "../../../fs"
import { USER_ID_PARAM } from "../../../fs/constants"
import { removeUserIdFromPath } from "../../../fs/utils/remove-user-id-from-path"
import { ExtensionsParams } from "../types"

export const updateExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { updateFile } }) =>
  (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

    updateFile({ path, content: req })
      .then(removeUserIdFromPath(userId))
      .then((file) => res.status(SuccessResponse.OK).json(file))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
