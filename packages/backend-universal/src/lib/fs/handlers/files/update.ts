import { ExceptionResponse, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFilePathParams } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const updateFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { updateFile } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

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
