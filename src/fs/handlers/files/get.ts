import { Switch } from "@ordo-pink/switch"
import { Exception, PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFilePath } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const getFileHandler: FsRequestHandler<Params> =
  ({ file: { getFileContent }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    getFileContent(path)
      .then((content) => content.pipe(res))
      .catch((error: Exception.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
