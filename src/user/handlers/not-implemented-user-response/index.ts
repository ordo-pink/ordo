import { RequestHandler } from "express"

export const defaultResponse: RequestHandler = (_req, res) => {
  res.status(501).send()
  return
}
