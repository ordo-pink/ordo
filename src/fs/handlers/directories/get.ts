import { Switch } from "@ordo-pink/switch"
import { Exception, PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoDirectoryPath } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const getDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { getDirectory }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    getDirectory(path)
      .then((directory) => res.status(200).json(directory))
      .catch((error: Exception.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
