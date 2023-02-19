import { Params } from "@ordo-pink/backend-universal"
import { UnaryFn } from "@ordo-pink/common-types"
import { RequestHandler } from "express"

/**
 * The authorisation stub is a middleware that enables access to local ordo
 * backend server without the need to authenticate via Ordo.pink SSO service.
 *
 * TODO: Use token as sub value when compareTokens is ready
 */
export const createAuthorisationStub: UnaryFn<string, RequestHandler<Params>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (token) => (req, __, next) => {
    req.params.tokenParsed = {
      sub: req.params.userId,
    }

    return next()
  }
