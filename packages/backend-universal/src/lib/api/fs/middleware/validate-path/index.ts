import { OrdoFile, Directory } from "@ordo-pink/fs-entity"
import type { RequestHandler } from "express"
import { ExceptionResponse } from "../../../../response-code"
import { OrdoFilePathParams, OrdoDirectoryPathParams } from "../../../../types"
import { PATH_PARAM } from "../../constants"

export const validateFilePath: RequestHandler<OrdoFilePathParams> = (req, res, next) => {
  if (!req.params[PATH_PARAM] || !OrdoFile.isValidPath(req.params[PATH_PARAM])) {
    req.params.logger.warn(`Invalid file path: ${req.params[PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid path")
  }

  return void next()
}

export const validateDirectoryPath: RequestHandler<OrdoDirectoryPathParams> = (req, res, next) => {
  if (!req.params[PATH_PARAM] || !Directory.isValidPath(req.params[PATH_PARAM])) {
    req.params.logger.warn(`Invalid directory path: ${req.params[PATH_PARAM]}`)

    return void res.status(ExceptionResponse.BAD_REQUEST).send("Invalid path")
  }

  return void next()
}
