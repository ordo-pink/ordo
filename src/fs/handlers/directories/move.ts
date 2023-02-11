import { ExceptionResponse, OrdoDirectoryPath, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { OLD_PATH_PARAM, NEW_PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

type Params = {
  [OLD_PATH_PARAM]: OrdoDirectoryPath
  [NEW_PATH_PARAM]: OrdoDirectoryPath
  [USER_ID_PARAM]: string
}

export const moveDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { moveDirectory }, logger }) =>
  (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    moveDirectory({ oldPath, newPath })
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.CREATED).json(directory))
      .catch((error: ExceptionResponse.NOT_FOUND | ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
