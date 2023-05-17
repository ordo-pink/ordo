import { DirectoryService, FileService } from "@ordo-pink/fs-entity"
import { GlobalStatsService } from "@ordo-pink/stats"
import { UserService } from "@ordo-pink/user"
import { Router } from "express"
import { PATH_PARAM, FILES_PARAM, DIRECTORIES_PARAM } from "./constants"
import { handleCreateDirectory } from "./handlers/create-directory.handler"
import { handleCreateFile } from "./handlers/create-file.handler"
import { handleGetDirectoryChildren } from "./handlers/get-directory.handler"
import { handleGetFile } from "./handlers/get-file.handler"
import { handleRemoveDirectory } from "./handlers/remove-directory.handler"
import { handleRemoveFile } from "./handlers/remove-file.handler"
import { handleUpdateFile, handleUpdateFileContent } from "./handlers/update-file.handler"
import { appendTrailingDirectoryPathSlash } from "./middleware/append-trailing-directory-slash"
import { checkSizeOfUploadingFile } from "./middleware/check-size-of-uploading-file"
import { prependPathSlash } from "./middleware/prepend-slash"
import { setContentTypeHeader } from "./middleware/set-content-type-header"
import { trimPath } from "./middleware/trim-paths"
import { validateFilePath, validateDirectoryPath } from "./middleware/validate-path"
import { USER_ID_PARAM } from "../../constants"
import { appendLogger } from "../../middleware/append-logger"
import { compareTokens } from "../../middleware/compare-tokens"
import { extractDynamicParam } from "../../middleware/extract-dynamic-param"
import { CreateOrdoBackendServerParams } from "../../types"

const filesRouter = ({
  fileDriver,
  metadataDriver,
  userDriver,
  statsDriver,
  authorise,
  logger,
  encrypters,
}: CreateOrdoBackendServerParams) => {
  const fileService = FileService.of(fileDriver, metadataDriver)
  const directoryService = DirectoryService.of(metadataDriver)
  const userService = UserService.of(userDriver)
  const globalStatsService = GlobalStatsService.of(statsDriver)

  const env = { fileService, directoryService, logger, encrypters, userService, globalStatsService }

  return Router()
    .post(
      `/:${USER_ID_PARAM}`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      checkSizeOfUploadingFile(env),
      handleCreateFile(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      validateFilePath,
      setContentTypeHeader,
      handleGetFile(env),
    )
    .patch(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      validateFilePath,
      checkSizeOfUploadingFile(env),
      handleUpdateFileContent(env),
    )
    .put(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      validateFilePath,
      checkSizeOfUploadingFile(env),
      handleUpdateFile(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      prependPathSlash,
      validateFilePath,
      handleRemoveFile(env),
    )
}

const directoriesRouter = ({
  fileDriver,
  metadataDriver,
  statsDriver,
  userDriver,
  authorise,
  logger,
  encrypters,
}: CreateOrdoBackendServerParams) => {
  const fileService = FileService.of(fileDriver, metadataDriver)
  const directoryService = DirectoryService.of(metadataDriver)
  const userService = UserService.of(userDriver)
  const globalStatsService = GlobalStatsService.of(statsDriver)

  const env = { fileService, directoryService, logger, encrypters, userService, globalStatsService }

  return Router()
    .post(
      `/:${USER_ID_PARAM}`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      validateDirectoryPath,
      handleCreateDirectory(env),
    )
    .get(
      `/:${USER_ID_PARAM}/`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      validateDirectoryPath,
      handleGetDirectoryChildren(env),
    )
    .get(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      handleGetDirectoryChildren(env),
    )
    .delete(
      `/:${USER_ID_PARAM}/:${PATH_PARAM}*`,

      appendLogger(logger),
      authorise,
      compareTokens(env),
      extractDynamicParam([PATH_PARAM]),
      trimPath,
      appendTrailingDirectoryPathSlash,
      validateDirectoryPath,
      handleRemoveDirectory(env),
    )
}

export const FSRouter = (context: CreateOrdoBackendServerParams) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(context))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(context))
