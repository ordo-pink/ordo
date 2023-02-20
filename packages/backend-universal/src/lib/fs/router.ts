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
import { extractDynamicParam } from "./middleware/extract-dynamic-param"
import { prependPathSlash, prependOldPathAndNewPathSlashes } from "./middleware/prepend-slash"
import { setContentTypeHeader } from "./middleware/set-content-type-header"
import { setRootPathParam } from "./middleware/set-root-path-param"
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

const filesRouter = ({ fsDriver, authorise: authorize, logger }: CreateOrdoBackendServerParams) => {
  const file = OrdoFileModel.of(fsDriver)
  const directory = OrdoDirectoryModel.of(fsDriver)
  const internal = OrdoInternalModel.of(fsDriver)

  const env = { file, directory, logger, internal }

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      checkSizeOfUploadingFile(env),
      createFileHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      setContentTypeHeader,
      getFileHandler(env),
    )
    .put(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      checkSizeOfUploadingFile(env),
      updateFileHandler(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependOldPathAndNewPathSlashes,
      addUserIdToOldPathAndNewPath,
      validateFileOldPathAndNewPath,
      moveFileHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      prependPathSlash,
      addUserIdToPath,
      validateFilePath,
      removeFileHandler(env),
    )
}

const directoriesRouter = ({
  fsDriver,
  authorise: authorize,
  logger,
}: CreateOrdoBackendServerParams) => {
  const file = OrdoFileModel.of(fsDriver)
  const directory = OrdoDirectoryModel.of(fsDriver)
  const internal = OrdoInternalModel.of(fsDriver)

  const env = { file, directory, logger, internal }

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      createDirectoryHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      setRootPathParam,
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      getDirectoryHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      getDirectoryHandler(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      appendTrailingDirectoryOldPathAndNewPathSlashes,
      addUserIdToOldPathAndNewPath,
      validateDirectoryOldPathAndNewPath,
      moveDirectoryHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorize,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPathSlash,
      addUserIdToPath,
      validateDirectoryPath,
      removeDirectoryHandler(env),
    )
}

export const FSRouter = (context: CreateOrdoBackendServerParams) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(context))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(context))
