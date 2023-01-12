import { FilePath, FsRequestHandler } from "$core/types"

export const createFile: FsRequestHandler<{ path: FilePath }> = () => (_, res) => {
  // TODO
  res.status(501).send()
}
