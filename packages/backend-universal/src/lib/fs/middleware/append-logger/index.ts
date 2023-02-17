import { RequestHandler } from "express"
import { Logger } from "../../../types"
import { Params } from "../../types"

export const appendLogger =
  (logger: Logger): RequestHandler<Params> =>
  (req, _, next) => {
    req.params.logger = logger

    next()
  }
