import { Readable } from "stream"
import { RequestHandler } from "express"
import { IOrdoDirectoryModel, IOrdoFileModel, Params } from "../../../types"
import { USER_ID_PARAM } from "../../constants"

type CheckMandatoryContentParams = {
  directory: IOrdoDirectoryModel
  file: IOrdoFileModel
}

export const createMandatoryContentIfMissing =
  ({ directory, file }: CheckMandatoryContentParams): RequestHandler<Params> =>
  async (req, __, next) => {
    const userId = req.params[USER_ID_PARAM]

    const root = `/${userId}/` as const
    const trash = `/${userId}/.trash/` as const
    const user = `/${userId}/user.metadata` as const
    // TODO: const cache = `/${userId}/usr/cache` as const
    // TODO: const mnt = `/${userId}/mnt/` as const

    const rootExists = await directory.checkDirectoryExists(root)
    const trashExists = await directory.checkDirectoryExists(trash)
    const userExists = await file.checkFileExists(user)

    if (!rootExists) {
      // TODO: Log to metrics
      req.params.logger.info("New user created! 🎉")
      await directory.createDirectory({ path: root, issuerId: userId })
    }

    if (!trashExists) {
      req.params.logger.debug("Trash bin is missing. Creating...")
      await directory.createDirectory({ path: trash, issuerId: userId })
      req.params.logger.debug("Trash bin created.")
    }

    if (!userExists) {
      req.params.logger.debug("User metadata is missing. Creating...")
      await file.createFile({
        path: user,
        issuerId: userId,
        content: Readable.from(JSON.stringify({ firstName: "", lastName: "" })),
      })
      req.params.logger.debug("User metadata created.")
    }

    next()
  }
