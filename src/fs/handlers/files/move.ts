import { ExceptionResponse, OrdoFilePath, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { OLD_PATH_PARAM, NEW_PATH_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"

type Params = {
  [OLD_PATH_PARAM]: OrdoFilePath
  [NEW_PATH_PARAM]: OrdoFilePath
}

export const moveFileHandler: FsRequestHandler<Params> =
  ({ file: { moveFile }, logger }) =>
  (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]

    moveFile({ oldPath, newPath })
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      .catch((error: ExceptionResponse.CONFLICT | ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
