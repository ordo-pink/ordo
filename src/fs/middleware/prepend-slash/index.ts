import { RequestHandler } from "express"

export const prependSlash: RequestHandler = (req, _, next) => {
  if (req.params.path && !req.params.path.startsWith("/")) {
    req.params.path = `/${req.params.path}`
  }

  if (req.params.oldPath && !req.params.oldPath.startsWith("/")) {
    req.params.oldPath = `/${req.params.oldPath}`
  }

  if (req.params.newPath && !req.params.newPath.startsWith("/")) {
    req.params.newPath = `/${req.params.newPath}`
  }

  next()
}
