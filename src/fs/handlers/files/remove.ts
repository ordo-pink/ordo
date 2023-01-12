import type { FilePath, FsRequestHandler } from "$core/types"

export const removeFile: FsRequestHandler<{ path: FilePath }> =
  ({ removeFile }) =>
  async (req, res) => {
    // TODO
    await removeFile(req.params.path)

    res.status(501).send()
  }
