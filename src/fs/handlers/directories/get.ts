import { OrdoDirectoryPath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const getDirectoryHandler: FsRequestHandler<Params> =
  ({ getDirectory }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherDirectory = await getDirectory(path)

    eitherDirectory.fold(
      () => res.status(404).send(),
      (directory) => res.status(200).json(directory),
    )
  }
