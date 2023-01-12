import { OrdoDirectoryPath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoDirectoryPath
}

export const createDirectoryHandler: FsRequestHandler<Params> =
  ({ createDirectory }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherDirectory = await createDirectory(path as OrdoDirectoryPath)

    eitherDirectory.fold(
      () => res.status(409).send(),
      (directory) => res.status(201).json(directory),
    )
  }
