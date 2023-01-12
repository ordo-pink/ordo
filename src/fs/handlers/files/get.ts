import { FsRequestHandler } from "$core/types"

export const getFile: FsRequestHandler = () => (req, res) => {
  // TODO
  res.status(501).json(req.params)
}
