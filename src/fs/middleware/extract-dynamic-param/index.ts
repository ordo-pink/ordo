import { RequestHandler } from "express"

export const extractDynamicParam =
  (keys: string[]): RequestHandler =>
  (req, _, next) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (!key) continue

      if (req.params[key] && req.params[i]) {
        req.params[key] = `/${req.params[key]}${req.params[i]}`
        req.params[i] = undefined as unknown as string
      }
    }

    next()
  }
