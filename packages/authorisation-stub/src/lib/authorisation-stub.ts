import { UnaryFn } from "@ordo-pink/common-types"
import { RequestHandler } from "express"

export const authorisationStub: UnaryFn<string, RequestHandler> = (token) => (_, __, next) => {
  return next()
}
