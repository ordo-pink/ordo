import { ExceptionResponse, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { OLD_PATH_PARAM, NEW_PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFileTwoPathsParams } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const moveFileHandler: FsRequestHandler<OrdoFileTwoPathsParams> =
  ({ file: { moveFile } }) =>
  (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    moveFile({ oldPath, newPath })
      .then(removeUserIdFromPath(userId))
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      .catch((error: ExceptionResponse.CONFLICT | ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
