import { ExceptionResponse } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFilePathParams } from "../../types"

export const getFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { getFileContent } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    getFileContent(path)
      .then((content) => content.pipe(res))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
