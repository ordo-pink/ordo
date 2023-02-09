import { Switch } from "@ordo-pink/switch"
import { Exception, PATH_PARAM } from "../../constants"
import { FsRequestHandler, OrdoFilePath } from "../../types"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const updateFileHandler: FsRequestHandler<Params> =
  ({ file: { updateFile }, logger }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]

    updateFile({ path, content: req })
      .then((file) => res.status(200).json(file))
      .catch((error: Exception.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => {
            logger.error(error)
            res.status(500).send()
          }),
      )
  }
