import { ExceptionResponse, OrdoDirectoryPath, SuccessResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const removeDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { deleteDirectory }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    deleteDirectory(path)
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
