import { ExceptionResponse, OrdoFilePath } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM } from "../../constants"
import { FsRequestHandler } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const getFileHandler: FsRequestHandler<Params> =
  ({ file: { getFileContent }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    getFileContent(path)
      .then((content) => content.pipe(res))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
