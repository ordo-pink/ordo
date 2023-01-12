import type { OrdoFilePath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const removeFileHandler: FsRequestHandler<Params> =
  ({ removeFile }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherFile = await removeFile(path)

    eitherFile.fold(
      () => res.status(404).send(),
      (file) => res.status(200).json(file),
    )
  }
