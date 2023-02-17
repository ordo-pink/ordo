import { Logger } from "@ordo-pink/logger"
import { RequestHandler } from "express"
import { Params } from "../../../types"

export const appendLogger =
  (logger: Logger): RequestHandler<Params> =>
  (req, _, next) => {
    req.params.logger = logger

    next()
  }
