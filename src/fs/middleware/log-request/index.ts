import { RequestHandler } from "express"
import { Logger } from "../../../types"

export const logRequest =
  (logger: Logger): RequestHandler =>
  (req, _, next) => {
    logger.info(`🚚 ${req.method} ${req.url}`)

    next()
  }
