import { OrdoFilePath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const createFileHandler: FsRequestHandler<Params> =
  ({ createFile }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherFile = await createFile(path, req)

    eitherFile.fold(
      () => res.status(409).send(),
      (file) => res.status(201).json(file),
    )
  }
