import { OrdoFilePath, ExceptionResponse, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const createFileHandler: FsRequestHandler<Params> =
  ({ file: { createFile }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    createFile({ path, content: req })
      .then((fileOrDirectory) => res.status(SuccessResponse.CREATED).json(fileOrDirectory))
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send())
          .default(() => {
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
