import { RequestHandler } from "express"
import { IOrdoDirectoryModel, Params } from "../../../types"
import { USER_ID_PARAM } from "../../constants"

type CheckMandatoryContentParams = {
  directory: IOrdoDirectoryModel
}

export const createMandatoryContentIfMissing =
  ({ directory }: CheckMandatoryContentParams): RequestHandler<Params> =>
  async (req, __, next) => {
    const userId = req.params[USER_ID_PARAM]

    const root = `/${userId}/` as const
    const trash = `/${userId}/.trash/` as const
    // TODO: const usr = `/${userId}/usr/` as const
    // TODO: const cache = `/${userId}/usr/cache` as const
    // TODO: const mnt = `/${userId}/mnt/` as const

    const rootExists = await directory.checkDirectoryExists(root)
    const trashExists = await directory.checkDirectoryExists(trash)

    if (!rootExists) {
      // TODO: Log to metrics
      req.params.logger.info("New user created!")
      await directory.createDirectory({ path: root, issuerId: userId })
    }

    if (!trashExists) {
      req.params.logger.debug("Trash bin is missing. Creating...")
      await directory.createDirectory({ path: trash, issuerId: userId })
      req.params.logger.debug("Trash bin created")
    }

    next()
  }
