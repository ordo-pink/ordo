import { Router } from "express"
import { createExtensionFileHandler } from "./handlers/create"
import { getExtensionFileHandler } from "./handlers/get"
import { removeExtensionFileHandler } from "./handlers/remove"
import { updateExtensionFileHandler } from "./handlers/update"
import { USER_ID_PARAM } from "../../fs/constants"
import { appendLogger } from "../../fs/middleware/append-logger"
import { compareTokensStrict } from "../../fs/middleware/compare-tokens"
import { OrdoDirectoryModel } from "../../fs/models/directory"
import { OrdoFileModel } from "../../fs/models/file"
import { CreateOrdoBackendServerParams } from "../../types"

export const ExtensionsRouter = ({
  fsDriver,
  authorise: authorize,
  logger,
}: CreateOrdoBackendServerParams) => {
  const file = OrdoFileModel.of(fsDriver)
  const directory = OrdoDirectoryModel.of(fsDriver)

  const env = { file, directory, logger }

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorize,
      compareTokensStrict,
      createExtensionFileHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorize,
      compareTokensStrict,
      getExtensionFileHandler(env),
    )
    .put(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorize,
      compareTokensStrict,
      updateExtensionFileHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorize,
      compareTokensStrict,
      removeExtensionFileHandler(env),
    )
}
