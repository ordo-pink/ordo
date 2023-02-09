import { Router } from "express"
import {
  PATH_PARAM,
  OLD_PATH_PARAM,
  PATH_SEPARATOR,
  NEW_PATH_PARAM,
  FILES_PARAM,
  DIRECTORIES_PARAM,
} from "./constants"
import { OrdoDirectoryModel } from "./entities/directory/ordo-directory-model"
import { OrdoFileModel } from "./entities/file/ordo-file-model"
import { createDirectoryHandler } from "./handlers/directories/create"
import { getDirectoryHandler } from "./handlers/directories/get"
import { moveDirectoryHandler } from "./handlers/directories/move"
import { removeDirectoryHandler } from "./handlers/directories/remove"
import { createFileHandler } from "./handlers/files/create"
import { getFileHandler } from "./handlers/files/get"
import { moveFileHandler } from "./handlers/files/move"
import { removeFileHandler } from "./handlers/files/remove"
import { updateFileHandler } from "./handlers/files/update"
import { addUserIdToPath } from "./middleware/add-user-id-to-path"
import { appendTrailingDirectoryPathSlash } from "./middleware/append-trailing-directory-slash"
import { extractDynamicParam } from "./middleware/extract-dynamic-param"
import { prependSlash } from "./middleware/prepend-slash"
import { setContentTypeHeader } from "./middleware/set-content-type-header"
import { setRootPathParam } from "./middleware/set-root-path-param"
import { validateFilePath, validateDirectoryPath } from "./middleware/validate-path"
import { AppContext } from "../types"
import { logRequest } from "./middleware/log-request"

const filesRouter = ({ fsDriver, authorize, logger }: AppContext) => {
  const file = OrdoFileModel(fsDriver)
  const directory = OrdoDirectoryModel(fsDriver)

  const env = { file, directory, logger }

  const log = logRequest(logger)

  return Router()
    .post(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      createFileHandler(env),
    )
    .get(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      setContentTypeHeader,
      log,
      getFileHandler(env),
    )
    .put(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      updateFileHandler(env),
    )
    .patch(
      `/:userId/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      authorize,
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      moveFileHandler(env),
    )
    .delete(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      removeFileHandler(env),
    )
}

const directoriesRouter = ({ fsDriver, authorize, logger }: AppContext) => {
  const file = OrdoFileModel(fsDriver)
  const directory = OrdoDirectoryModel(fsDriver)

  const env = { file, directory, logger }

  const log = logRequest(logger)

  return Router()
    .post(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      addUserIdToPath,
      log,
      createDirectoryHandler(env),
    )
    .get(
      `/`,

      authorize,
      setRootPathParam,
      prependSlash,
      addUserIdToPath,
      log,
      getDirectoryHandler(env),
    )
    .get(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      addUserIdToPath,
      log,
      getDirectoryHandler(env),
    )
    .patch(
      `/:userId/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      authorize,
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      addUserIdToPath,
      log,
      moveDirectoryHandler(env),
    )
    .delete(
      `/:userId/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      addUserIdToPath,
      log,
      removeDirectoryHandler(env),
    )
}

export const FSRouter = (drivers: AppContext) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(drivers))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(drivers))
