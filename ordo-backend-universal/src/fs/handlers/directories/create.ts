import { ExceptionResponse, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler, OrdoDirectoryPathParams } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const createDirectoryHandler: FsRequestHandler<OrdoDirectoryPathParams> =
  ({ directory: { createDirectory } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    createDirectory(path)
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.CREATED).json(directory))
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
