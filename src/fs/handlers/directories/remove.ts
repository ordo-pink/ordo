import { ExceptionResponse, OrdoDirectoryPath, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
  [USER_ID_PARAM]: string
}

export const removeDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { deleteDirectory }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    deleteDirectory(path)
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.OK).json(directory))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
