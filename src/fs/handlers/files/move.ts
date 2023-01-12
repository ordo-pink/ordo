import { Switch } from "$core/switch"
import { OrdoFilePath, FsRequestHandler } from "$core/types"

import { Exception, NEW_PATH_PARAM, OLD_PATH_PARAM } from "$fs/constants"

type Params = {
  [OLD_PATH_PARAM]: OrdoFilePath
  [NEW_PATH_PARAM]: OrdoFilePath
}

export const moveFileHandler: FsRequestHandler<Params> =
  ({ moveFile }) =>
  async (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]

    const eitherFile = await moveFile(oldPath, newPath)

    eitherFile.fold(
      (e) => {
        const handle = Switch.of(e)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => res.status(409).send())

        handle()
      },
      (file) => res.status(201).json(file),
    )
    // TODO

    res.status(501).send()
  }
