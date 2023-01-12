import type { OrdoDirectoryPath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const removeDirectoryHandler: FsRequestHandler<Params> =
  ({ removeDirectory }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherDirectory = await removeDirectory(path)

    eitherDirectory.fold(
      () => res.status(404).send(),
      (directory) => res.status(200).json(directory),
    )
  }
