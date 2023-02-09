import { Switch } from "@ordo-pink/switch"
import { Exception, PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFilePath } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const createFileHandler: FsRequestHandler<Params> =
  ({ file: { createFile }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    createFile({ path, content: req })
      .then((fileOrDirectory) => res.status(201).json(fileOrDirectory))
      .catch((error: Exception.CONFLICT | Error) =>
        Switch.of(error)
          .case(Exception.CONFLICT, () => res.status(409).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
