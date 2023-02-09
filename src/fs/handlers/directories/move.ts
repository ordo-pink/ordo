import { Switch } from "@ordo-pink/switch"
import { OLD_PATH_PARAM, NEW_PATH_PARAM, Exception } from "../../constants"
import { FsRequestHandler, OrdoDirectoryPath } from "../../types"

type Params = {
  [OLD_PATH_PARAM]: OrdoDirectoryPath
  [NEW_PATH_PARAM]: OrdoDirectoryPath
}

export const moveDirectoryHandler: FsRequestHandler<Params> =
  ({ directory: { moveDirectory }, logger }) =>
  (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]

    moveDirectory({ oldPath, newPath })
      .then((directory) => res.status(201).json(directory))
      .catch((error: Exception.NOT_FOUND | Exception.CONFLICT | Error) =>
        Switch.of(error)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .case(Exception.CONFLICT, () => res.status(409).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
