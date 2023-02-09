import { RequestHandler } from "express"

export const authorizationStub: RequestHandler = (_, __, next) => {
  return next()
}
