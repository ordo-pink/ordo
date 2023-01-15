import type { RequestHandler } from "express"

export const prependFilePathSlash: RequestHandler = (req, _, next) => {
  if (req.params.path && !req.params.path.includes("/")) {
    req.params.path = `/${req.params.path}`
  }

  next()
}
