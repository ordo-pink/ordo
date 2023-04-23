import { SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoDirectoryTwoPathsParams } from "../../../types"
import { OLD_PATH_PARAM, NEW_PATH_PARAM, USER_ID_PARAM, TOKEN_PARSED_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const moveDirectoryHandler: FsRequestHandler<OrdoDirectoryTwoPathsParams> =
  ({ directory: { moveDirectory } }) =>
  (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub

    moveDirectory({ oldPath, newPath, issuerId })
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.CREATED).json(directory))
      .catch((error: ExceptionResponse.NOT_FOUND | ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () =>
            res.status(ExceptionResponse.NOT_FOUND).send("{}"),
          )
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send("{}"))
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
