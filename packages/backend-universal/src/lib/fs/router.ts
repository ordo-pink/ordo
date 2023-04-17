import { Router } from "express"
import {
  PATH_PARAM,
  OLD_PATH_PARAM,
  PATH_SEPARATOR,
  NEW_PATH_PARAM,
  FILES_PARAM,
  DIRECTORIES_PARAM,
  USER_ID_PARAM,
} from "./constants"
import { createDirectoryHandler } from "./handlers/directories/create"
import { getDirectoryHandler } from "./handlers/directories/get"
import { moveDirectoryHandler } from "./handlers/directories/move"
import { removeDirectoryHandler } from "./handlers/directories/remove"
import { createFileHandler } from "./handlers/files/create"
import { getFileHandler } from "./handlers/files/get"
import { moveFileHandler } from "./handlers/files/move"
import { removeFileHandler } from "./handlers/files/remove"
import { updateFileHandler } from "./handlers/files/update"
import { addUserIdToOldPathAndNewPath, addUserIdToPath } from "./middleware/add-user-id-to-path"
import { appendLogger } from "./middleware/append-logger"
import {
  appendTrailingDirectoryOldPathAndNewPathSlashes,
  appendTrailingDirectoryPathSlash,
} from "./middleware/append-trailing-directory-slash"
import { checkSizeOfUploadingFile } from "./middleware/check-size-of-uploading-file"
import { compareTokens } from "./middleware/compare-tokens"
import { createMandatoryContentIfMissing } from "./middleware/create-mandatory-content-if-missing"
import { extractDynamicParam } from "./middleware/extract-dynamic-param"
import { prependPathSlash, prependOldPathAndNewPathSlashes } from "./middleware/prepend-slash"
import { setContentTypeHeader } from "./middleware/set-content-type-header"
import { setRootPathParam } from "./middleware/set-root-path-param"
import { trimOldPathAndNewPath, trimPath } from "./middleware/trim-paths"
import {
  validateFilePath,
  validateDirectoryPath,
  validateFileOldPathAndNewPath,
  validateDirectoryOldPathAndNewPath,
} from "./middleware/validate-path"
import { OrdoDirectoryModel } from "./models/directory"
import { OrdoFileModel } from "./models/file"
import { OrdoInternalModel } from "../internal/models/internal-model"
import { CreateOrdoBackendServerParams } from "../types"

const filesRouter = ({ fsDriver, authorise, logger, encrypt }: CreateOrdoBackendServerParams) => {
  const file = OrdoFileModel.of({ driver: fsDriver, logger })
  const directory = OrdoDirectoryModel.of({ driver: fsDriver, logger })
  const internal = OrdoInternalModel.of({ fsDriver, directory })

  const env = { file, directory, logger, internal, encrypt }

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      createMandatoryContentIfMissing({ directory, file }),
      checkSizeOfUploadingFile(env),
      createFileHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      createMandatoryContentIfMissing({ directory, file }),
      setContentTypeHeader,
      getFileHandler(env),
    )
    .put(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      createMandatoryContentIfMissing({ directory, file }),
      checkSizeOfUploadingFile(env),
      updateFileHandler(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      trimOldPathAndNewPath,
      prependOldPathAndNewPathSlashes,
      addUserIdToOldPathAndNewPath,
      validateFileOldPathAndNewPath,
      createMandatoryContentIfMissing({ directory, file }),
      moveFileHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      createMandatoryContentIfMissing({ directory, file }),
      removeFileHandler(env),
    )
}

const directoriesRouter = ({
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
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      createMandatoryContentIfMissing({ directory, file }),
      createDirectoryHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      setRootPathParam,
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      createMandatoryContentIfMissing({ directory, file }),
      getDirectoryHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      createMandatoryContentIfMissing({ directory, file }),
      getDirectoryHandler(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      trimOldPathAndNewPath,
      appendTrailingDirectoryOldPathAndNewPathSlashes,
      addUserIdToOldPathAndNewPath,
      validateDirectoryOldPathAndNewPath,
      createMandatoryContentIfMissing({ directory, file }),
      moveDirectoryHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      createMandatoryContentIfMissing({ directory, file }),
      removeDirectoryHandler(env),
    )
}

export const FSRouter = (context: CreateOrdoBackendServerParams) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(context))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(context))
