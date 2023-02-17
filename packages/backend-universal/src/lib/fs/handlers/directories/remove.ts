import { SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoDirectoryPathParams } from "../../../types"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const removeDirectoryHandler: FsRequestHandler<OrdoDirectoryPathParams> =
  ({ directory: { deleteDirectory } }) =>
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
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
