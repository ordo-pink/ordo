import { UserDriver } from "$core/types"

export const authorize =
  (token: string): UserDriver["authorize"] =>
  (req, res, next) => {
    if (!req.headers.authorization) {
      res.status(401).send()
      return
    }

    if (req.headers.authorization !== `Bearer ${token}`) {
      res.status(403).send()
      return
    }

    next()
  }
