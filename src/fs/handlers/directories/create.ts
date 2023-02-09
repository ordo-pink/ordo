import { Switch } from "@ordo-pink/switch"
import { Exception, PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoDirectoryPath } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const createDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { createDirectory }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    createDirectory(path)
      .then((directory) => res.status(201).json(directory))
      .catch((error: Exception.CONFLICT | Error) =>
        Switch.of(error)
          .case(Exception.CONFLICT, () => res.status(409).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
