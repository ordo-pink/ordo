import { ExceptionResponse, OrdoFilePath, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

type Params = {
  [PATH_PARAM]: OrdoFilePath
  [USER_ID_PARAM]: string
}

export const updateFileHandler: FsRequestHandler<Params> =
  ({ file: { updateFile }, logger }) =>
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
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
