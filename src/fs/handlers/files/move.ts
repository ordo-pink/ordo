import { Switch } from "@ordo-pink/switch"
import { OLD_PATH_PARAM, NEW_PATH_PARAM, Exception } from "../../constants"
import { FsRequestHandler, OrdoFilePath } from "../../types"

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
      .then((fileOrDirectory) => res.status(201).json(fileOrDirectory))
      .catch((error: Exception.CONFLICT | Exception.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .case(Exception.CONFLICT, () => res.status(409).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
