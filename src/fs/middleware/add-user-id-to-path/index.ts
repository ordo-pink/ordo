import { RequestHandler } from "express"
import { USER_ID_PARAM } from "../../constants"

export const addUserIdToPath: RequestHandler = (req, _, next) => {
  if (req.params.path != null) {
    req.params.path = `/${req.params[USER_ID_PARAM]}${req.params.path}`
  }

  if (req.params.oldPath != null) {
    req.params.oldPath = `/${req.params[USER_ID_PARAM]}${req.params.oldPath}`
  }

  if (req.params.newPath != null) {
    req.params.newPath = `/${req.params[USER_ID_PARAM]}${req.params.newPath}`
  }

  next()
}
