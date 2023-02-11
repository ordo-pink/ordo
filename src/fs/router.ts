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
import { addUserIdToPath } from "./middleware/add-user-id-to-path"
import { appendTrailingDirectoryPathSlash } from "./middleware/append-trailing-directory-slash"
import { extractDynamicParam } from "./middleware/extract-dynamic-param"
import { logRequest } from "./middleware/log-request"
import { prependSlash } from "./middleware/prepend-slash"
import { setContentTypeHeader } from "./middleware/set-content-type-header"
import { setRootPathParam } from "./middleware/set-root-path-param"
import { validateFilePath, validateDirectoryPath } from "./middleware/validate-path"
import { OrdoDirectoryModel } from "./models/directory"
import { OrdoFileModel } from "./models/file"
import { AppContext } from "../types"

const filesRouter = ({ fsDriver, authorize, logger }: AppContext) => {
  const file = OrdoFileModel(fsDriver)
  const directory = OrdoDirectoryModel(fsDriver)

  const env = { file, directory, logger }

  const log = logRequest(logger)

  return Router()
    .post(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      createFileHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

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
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      authorize,
      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      updateFileHandler(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      authorize,
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      validateFilePath,
      addUserIdToPath,
      log,
      moveFileHandler(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

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
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

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
      `/:${USER_ID_PARAM}`,

      authorize,
      setRootPathParam,
      prependSlash,
      addUserIdToPath,
      log,
      getDirectoryHandler(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

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
      `/:${USER_ID_PARAM}/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

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
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

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
