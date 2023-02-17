import { Logger } from "@ordo-pink/common-types"
import { RequestHandler } from "express"
import { Params } from "../../../types"

export const appendLogger =
  (logger: Logger): RequestHandler<Params> =>
  (req, _, next) => {
    req.params.logger = logger

    next()
  }
