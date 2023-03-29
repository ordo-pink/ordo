import { RequestHandler } from "express"
import { Params } from "../../../types"

export const extractDynamicParam =
  (keys: string[]): RequestHandler<Params<Record<string, unknown>>> =>
  (req, _, next) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as string

      if (req.params[key]) {
        if (req.params[i]) {
          req.params[key] = `/${req.params[key]}${req.params[i]}`
          delete req.params[i]
        } else {
          req.params[key] = `/${req.params[key]}`
        }
      }
    }

    next()
  }
