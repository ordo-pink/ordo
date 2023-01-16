import type { Drivers } from "$core/types"

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

const filesRouter = ({ fsDriver, userDriver: { protect, authorize } }: Drivers) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      createFileHandler(fsDriver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write", "read"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      setContentTypeHeader,
      getFileHandler(fsDriver),
    )
    .put(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      updateFileHandler(fsDriver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      validateFilePath,
      moveFileHandler(fsDriver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      validateFilePath,
      removeFileHandler(fsDriver),
    )

const directoriesRouter = ({ fsDriver, userDriver: { protect, authorize } }: Drivers) =>
  Router()
    .post(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      createDirectoryHandler(fsDriver),
    )
    .get(
      `/`,

      protect(["owner", "admin", "write", "read"]),
      authorize,

      setRootPathParam,
      prependSlash,
      getDirectoryHandler(fsDriver),
    )
    .get(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write", "read"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      getDirectoryHandler(fsDriver),
    )
    .patch(
      `/:${OLD_PATH_PARAM}*${PATH_SEPARATOR}/:${NEW_PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([OLD_PATH_PARAM, NEW_PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      moveDirectoryHandler(fsDriver),
    )
    .delete(
      `/:${PATH_PARAM}*`,

      protect(["owner", "admin", "write"]),
      authorize,

      extractDynamicParam([PATH_PARAM]),
      prependSlash,
      appendTrailingDirectoryPath,
      validateDirectoryPath,
      removeDirectoryHandler(fsDriver),
    )

export default (drivers: Drivers) =>
  Router()
    .use(`/${FILES_PARAM}`, filesRouter(drivers))
    .use(`/${DIRECTORIES_PARAM}`, directoriesRouter(drivers))
