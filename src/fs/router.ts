import type { FSDriver } from "$core/types"

import {
  OLD_PATH_PARAM,
  NEW_PATH_PARAM,
  PATH_PARAM,
  FILES_PARAM,
  DIRECTORIES_PARAM,
  PATH_SEPARATOR,
} from "$fs/constants"

import { createDirectoryHandler } from "$fs/handlers/directories/create"
import { getDirectoryHandler } from "$fs/handlers/directories/get"
import { Router } from "express"
import { moveDirectoryHandler } from "$fs/handlers/directories/move"
import { removeDirectoryHandler } from "$fs/handlers/directories/remove"
import { createFileHandler } from "$fs/handlers/files/create"
import { getFileHandler } from "$fs/handlers/files/get"
import { removeFileHandler } from "$fs/handlers/files/remove"
import { updateFileHandler } from "$fs/handlers/files/update"

import { appendTrailingDirectoryPath } from "$fs/middleware/add-trailing-directory-slash"
import { extractDynamicParam } from "$fs/middleware/extract-dynamic-param"
import { setRootPathParam } from "$fs/middleware/set-root-path-param"
import { validateDirectoryPath, validateFilePath } from "$fs/middleware/validate-path"
import { setContentTypeHeader } from "./middleware/set-content-type-header"

const filesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      createFileHandler(driver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      setContentTypeHeader,
      getFileHandler(driver),
    )
    .put(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      updateFileHandler(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      validateFilePath,
      moveDirectoryHandler(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      removeFileHandler(driver),
    )

const directoriesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      createDirectoryHandler(driver),
    )
    .get(
      `/`,

      setRootPathParam,
      getDirectoryHandler(driver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      getDirectoryHandler(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      moveDirectoryHandler(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      removeDirectoryHandler(driver),
    )

export default (driver: FSDriver) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(driver))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(driver))
