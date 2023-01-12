import { OrdoFilePath, FsRequestHandler } from "$core/types"

import { PATH_PARAM } from "$fs/constants"

type Params = {
  [PATH_PARAM]: OrdoFilePath
}

export const getFileHandler: FsRequestHandler<Params> =
  ({ getFile }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]

    const eitherFile = await getFile(path)

    eitherFile.fold(
      () => res.status(404).send(),
      (fileStream) => fileStream.pipe(res),
    )
  }
