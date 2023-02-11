import { RequestHandler } from "express"

export const extractDynamicParam =
  (keys: string[]): RequestHandler =>
  (req, _, next) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as string

      if (req.params[key]) {
        if (req.params[i]) {
          req.params[key] = `/${req.params[key]}${req.params[i]}`
          req.params[i] = undefined as unknown as string
        } else {
          req.params[key] = `/${req.params[key]}`
        }
      }
    }

    next()
  }
