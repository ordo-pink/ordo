import { DirectoryPath, FsRequestHandler } from "$core/types"

export const createDirectory: FsRequestHandler<{ path: DirectoryPath }> =
  ({ createFile }) =>
  async (req, res) => {
    const path = req.params.path
    const body = req.body ?? ""

    await createFile(path as DirectoryPath, body)

    // TODO
    res.status(501).send()
  }
