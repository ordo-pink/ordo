import { Params } from "@ordo-pink/backend-universal"
import { UnaryFn } from "@ordo-pink/common-types"
import { RequestHandler } from "express"

/**
 * The authorisation stub is a middleware that enables access to local ordo
 * backend server without the need to authenticate via Ordo.pink SSO service.
 */
export const createAuthorisationStub: UnaryFn<string, RequestHandler<Params>> =
  (token) => (req, __, next) => {
    req.params.tokenParsed = {
      sub: token,
    }

    return next()
  }
