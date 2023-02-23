import { OrdoFile, OrdoDirectory, ExceptionResponse, SystemDirectory } from "@ordo-pink/core"
import type { RequestHandler } from "express"
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM, USER_ID_PARAM } from "../../constants"
import {
  OrdoDirectoryPathParams,
  OrdoDirectoryTwoPathsParams,
  OrdoFilePathParams,
  OrdoFileTwoPathsParams,
} from "../../types"

const checkIsInternalPath = (userId: string) => (path: string) =>
  path.startsWith(`/${userId}${SystemDirectory.INTERNAL}`)

export const validateFilePath: RequestHandler<OrdoFilePathParams> = (req, res, next) => {
  const isInternalPath = checkIsInternalPath(req.params[USER_ID_PARAM])

  if (
    !req.params[PATH_PARAM] ||
    !OrdoFile.isValidPath(req.params[PATH_PARAM]) ||
    isInternalPath(req.params[PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid file path: ${req.params[PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid path")
  }

  return void next()
}

export const validateFileOldPathAndNewPath: RequestHandler<OrdoFileTwoPathsParams> = (
  req,
  res,
  next,
) => {
  if (req.params[OLD_PATH_PARAM] === req.params[NEW_PATH_PARAM]) {
    req.params.logger.info(
      `Old file path and new file path are equal: ${req.params[OLD_PATH_PARAM]}, ${req.params[NEW_PATH_PARAM]}`,
    )

    return void res
      .status(ExceptionResponse.BAD_REQUEST)
      .send("oldPath and newPath must be different")
  }

  const isInternalPath = checkIsInternalPath(req.params[USER_ID_PARAM])

  if (
    !req.params[OLD_PATH_PARAM] ||
    !OrdoFile.isValidPath(req.params[OLD_PATH_PARAM]) ||
    isInternalPath(req.params[OLD_PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid old file path: ${req.params[OLD_PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid oldPath")
  }

  if (
    !req.params[NEW_PATH_PARAM] ||
    !OrdoFile.isValidPath(req.params[NEW_PATH_PARAM]) ||
    isInternalPath(req.params[NEW_PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid new file path: ${req.params[NEW_PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid newPath")
  }

  return void next()
}

export const validateDirectoryPath: RequestHandler<OrdoDirectoryPathParams> = (req, res, next) => {
  const isInternalPath = checkIsInternalPath(req.params[USER_ID_PARAM])

  if (
    !req.params[PATH_PARAM] ||
    !OrdoDirectory.isValidPath(req.params[PATH_PARAM]) ||
    isInternalPath(req.params[PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid directory path: ${req.params[PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid path")
  }

  return void next()
}

export const validateDirectoryOldPathAndNewPath: RequestHandler<OrdoDirectoryTwoPathsParams> = (
  req,
  res,
  next,
) => {
  if (req.params[OLD_PATH_PARAM] === "/" || req.params[NEW_PATH_PARAM] === "/") {
    req.params.logger.info(
      `Cannot move root: ${req.params[OLD_PATH_PARAM]}, ${req.params[NEW_PATH_PARAM]}`,
    )

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Cannot move root")
  }

  if (req.params[OLD_PATH_PARAM] === req.params[NEW_PATH_PARAM]) {
    req.params.logger.info(
      `Old directory path and new directory path are equal: ${req.params[OLD_PATH_PARAM]}, ${req.params[NEW_PATH_PARAM]}`,
    )

    return void res
      .status(ExceptionResponse.BAD_REQUEST)
      .send("oldPath and newPath must be different")
  }

  const isInternalPath = checkIsInternalPath(req.params[USER_ID_PARAM])

  if (
    !req.params[OLD_PATH_PARAM] ||
    !OrdoDirectory.isValidPath(req.params[OLD_PATH_PARAM]) ||
    isInternalPath(req.params[OLD_PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid old directory path: ${req.params[OLD_PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid oldPath")
  }

  if (
    !req.params[NEW_PATH_PARAM] ||
    !OrdoDirectory.isValidPath(req.params[NEW_PATH_PARAM]) ||
    isInternalPath(req.params[NEW_PATH_PARAM])
  ) {
    req.params.logger.info(`Invalid new directory path: ${req.params[NEW_PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid newPath")
  }

  return void next()
}
