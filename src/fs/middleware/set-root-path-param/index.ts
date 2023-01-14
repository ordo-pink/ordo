import type { RequestHandler } from "express"

export const setRootPathParam: RequestHandler = (req, _, next) => {
  req.params.path = ""

  next()
}
