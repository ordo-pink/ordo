import type { FSDriver } from "$core/types"
import {
  OLD_PATH_PARAM,
  NEW_PATH_PARAM,
  PATH_PARAM,
  FILES_PARAM,
  DIRECTORIES_PARAM,
  PATH_SEPARATOR,
} from "$fs/constants"

import { Router } from "express"

import { createDirectory } from "$fs/handlers/directories/create"
import { getDirectory } from "$fs/handlers/directories/get"
import { moveDirectory } from "$fs/handlers/directories/move"
import { removeDirectory } from "$fs/handlers/directories/remove"
import { createFile } from "$fs/handlers/files/create"
import { getFile } from "$fs/handlers/files/get"
import { removeFile } from "$fs/handlers/files/remove"
import { updateFile } from "$fs/handlers/files/update"

import { extractDynamicParam } from "$fs/middleware/extract-dynamic-param"
import { validateDirectoryPath, validateFilePath } from "$fs/middleware/validate-path"

const filesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      createFile(driver),
    )
    .get(`/:${PATH_PARAM}*`, extractDynamicParam([PATH_PARAM]), validateFilePath, getFile(driver))
    .put(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      updateFile(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      validateFilePath,
      moveDirectory(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateFilePath,
      removeFile(driver),
    )

const directoriesRouter = (driver: FSDriver) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateDirectoryPath,
      createDirectory(driver),
    )
    .get(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateDirectoryPath,
      getDirectory(driver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,
      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      validateDirectoryPath,
      moveDirectory(driver),
    )
    .delete(
      `/:${PATH_PARAM}*`,
      extractDynamicParam([PATH_PARAM]),
      validateDirectoryPath,
      removeDirectory(driver),
    )

export default (driver: FSDriver) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(driver))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(driver))
