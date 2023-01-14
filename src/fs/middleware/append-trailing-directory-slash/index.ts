import { RequestHandler } from "express"

export const appendTrailingDirectoryPath: RequestHandler = (req, _, next) => {
  if (req.params.path && !req.params.path.endsWith("/")) {
    req.params.path = `${req.params.path}/`
  }

  if (req.params.oldPath && !req.params.oldPath.endsWith("/")) {
    req.params.oldPath = `${req.params.oldPath}/`
  }

  if (req.params.newPath && !req.params.newPath.endsWith("/")) {
    req.params.newPath = `${req.params.newPath}/`
  }

  next()
}
