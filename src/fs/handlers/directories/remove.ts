import type { DirectoryPath, FsRequestHandler } from "$core/types"

export const removeDirectory: FsRequestHandler<{ path: DirectoryPath }> =
  ({ removeDirectory }) =>
  async (req, res) => {
    // TODO
    await removeDirectory(req.params.path)

    res.status(501).send()
  }
