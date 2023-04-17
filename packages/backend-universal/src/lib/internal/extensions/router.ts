import { Router } from "express"
import { getExtensionFileHandler } from "./handlers/get"
import { removeExtensionFileHandler } from "./handlers/remove"
import { updateExtensionFileHandler } from "./handlers/update"
import { USER_ID_PARAM } from "../../fs/constants"
import { appendLogger } from "../../fs/middleware/append-logger"
import { compareTokensStrict } from "../../fs/middleware/compare-tokens"
import { createMandatoryContentIfMissing } from "../../fs/middleware/create-mandatory-content-if-missing"
import { OrdoDirectoryModel } from "../../fs/models/directory"
import { OrdoFileModel } from "../../fs/models/file"
import { CreateOrdoBackendServerParams } from "../../types"
import { OrdoInternalModel } from "../models/internal-model"

export const ExtensionsRouter = ({
  fsDriver,
  authorise,
  logger,
  encrypt,
}: CreateOrdoBackendServerParams) => {
  const file = OrdoFileModel.of({ driver: fsDriver, logger })
  const directory = OrdoDirectoryModel.of({ driver: fsDriver, logger })
  const internal = OrdoInternalModel.of({ fsDriver, directory })

  const env = { file, directory, logger, internal, encrypt }

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorise,
      compareTokensStrict,
      createMandatoryContentIfMissing({ directory }),
      getExtensionFileHandler(env),
    )
    .put(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorise,
      compareTokensStrict,
      createMandatoryContentIfMissing({ directory }),
      updateExtensionFileHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:extension`,

      appendLogger(logger),
      authorise,
      compareTokensStrict,
      createMandatoryContentIfMissing({ directory }),
      removeExtensionFileHandler(env),
    )
}
