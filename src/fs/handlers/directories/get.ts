import { FsRequestHandler } from "$core/types"

export const getDirectory: FsRequestHandler = () => async (_, res) => {
  // TODO
  res.status(501).send()
}
