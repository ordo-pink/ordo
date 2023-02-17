import { Params } from "@ordo-pink/backend-universal"
import { UnaryFn } from "@ordo-pink/common-types"
import { RequestHandler } from "express"

export const createAuthorisationStub: UnaryFn<string, RequestHandler<Params>> =
  (token) => (req, __, next) => {
    req.params.tokenParsed = {
      sub: token,
    }

    return next()
  }
