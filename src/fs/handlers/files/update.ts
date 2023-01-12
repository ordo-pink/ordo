import { OrdoFilePath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const updateFileHandler: FsRequestHandler<Params> =
  ({ updateFile }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherFile = await updateFile(path, req)

    eitherFile.fold(
      () => res.status(404).send(),
      (file) => res.status(200).json(file),
    )
  }
