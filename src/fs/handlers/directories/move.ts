import { Switch } from "$core/switch"
import { OrdoDirectoryPath, FsRequestHandler } from "$core/types"

import { Exception, NEW_PATH_PARAM, OLD_PATH_PARAM } from "$fs/constants"

type Params = {
  [OLD_PATH_PARAM]: OrdoDirectoryPath
  [NEW_PATH_PARAM]: OrdoDirectoryPath
}

export const moveDirectoryHandler: FsRequestHandler<Params> =
  ({ moveDirectory }) =>
  async (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]

    const eitherDirectory = await moveDirectory(oldPath, newPath)

    eitherDirectory.fold(
      (e) => {
        const handle = Switch.of(e)
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => res.status(409).send())

        handle()
      },
      (directory) => res.status(201).json(directory),
    )

    res.status(501).send()
  }
