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
import { moveDirectoryHandler } from "$fs/handlers/directories/move"
import { removeDirectoryHandler } from "$fs/handlers/directories/remove"
import { createFileHandler } from "$fs/handlers/files/create"
import { Router } from "express"
import { getFileHandler } from "$fs/handlers/files/get"
import { moveFileHandler } from "$fs/handlers/files/move"
import { removeFileHandler } from "$fs/handlers/files/remove"
import { updateFileHandler } from "$fs/handlers/files/update"

import { appendTrailingDirectoryPath } from "$fs/middleware/append-trailing-directory-slash"
import { extractDynamicParam } from "$fs/middleware/extract-dynamic-param"
import { prependSlash } from "$fs/middleware/prepend-slash"
import { setContentTypeHeader } from "$fs/middleware/set-content-type-header"
import { setRootPathParam } from "$fs/middleware/set-root-path-param"
import { validateDirectoryPath, validateFilePath } from "$fs/middleware/validate-path"

const filesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      createFileHandler(driver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      setContentTypeHeader,
      getFileHandler(driver),
    )
    .put(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      updateFileHandler(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      validateFilePath,
      moveFileHandler(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      removeFileHandler(driver),
    )

const directoriesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      createDirectoryHandler(driver),
    )
    .get(
      `/`,

      setRootPathParam,
      prependSlash,
      getDirectoryHandler(driver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      getDirectoryHandler(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      moveDirectoryHandler(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      removeDirectoryHandler(driver),
    )

export default (driver: FSDriver) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(driver))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(driver))
