import { ExceptionResponse } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { Logger } from "@ordo-pink/logger"
import { OrdoDirectoryModel } from "./directory"
import { FSDriver, IOrdoFileModel } from "../../types"

type InitParams = {
  driver: FSDriver
  logger: Logger
}

const GET_CONTENT_TAG = "OrdoFileModel::getFileContent"
const CREATE_TAG = "OrdoFileModel::createFile"
const REMOVE_TAG = "OrdoFileModel::removeFile"
const UPDATE_TAG = "OrdoFileModel::updateFile"
const MOVE_TAG = "OrdoFileModel::moveFile"
const GET_TAG = "OrdoFileModel::getFile"

export const OrdoFileModel = {
  of: ({ driver, logger }: InitParams): IOrdoFileModel => ({
    checkFileExists: driver.checkFileExists,
    createFile: ({ path, content }) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoFile.isValidPath(path)) {
            logger.warn(CREATE_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) =>
          Promise.all([
            driver.checkFileExists(path),
            driver.checkDirectoryExists(OrdoFile.getParentPath(path)),
          ]),
        )
        .then(([fileExists, parentDirectoryExists]) => {
          if (fileExists) {
            logger.warn(CREATE_TAG, "Already exists", path)
            throw ExceptionResponse.CONFLICT
          }

          return { path, parentDirectoryExists }
        })
        .then(async ({ path, parentDirectoryExists }) => {
          const parentDirectory = !parentDirectoryExists
            ? await OrdoDirectoryModel.of({ driver, logger }).createDirectory(
                OrdoFile.getParentPath(path),
              )
            : null

          return { path, parentDirectory }
        })
        .then(async ({ path, parentDirectory }) => {
          await driver.createFile({ path, content })

          logger.debug(CREATE_TAG, path)

          return parentDirectory
            ? OrdoDirectoryModel.of({ driver, logger }).getDirectory(parentDirectory.path)
            : OrdoFileModel.of({ driver, logger }).getFile(path)
        }),
    deleteFile: (path) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoFile.isValidPath(path)) {
            logger.warn(REMOVE_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) => driver.checkFileExists(path))
        .then((exists) => {
          if (!exists) {
            logger.warn(REMOVE_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then(OrdoFileModel.of({ driver, logger }).getFile)
        .then(async (file) => {
          await driver.deleteFile(file.path)

          if (!file.path.endsWith(".metadata")) {
            const metadataPath = `${file.path}.metadata` as const

            if (await driver.checkFileExists(metadataPath)) {
              await driver.deleteFile(metadataPath)
              logger.debug(REMOVE_TAG, "Metadata deleted", metadataPath)
            }
          }

          logger.debug(REMOVE_TAG, path)

          return file
        }),
    getFile: (path) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoFile.isValidPath(path)) {
            logger.warn(GET_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) => driver.checkFileExists(path))
        .then((exists) => {
          if (!exists) {
            logger.warn(GET_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then(() => driver.getFileDescriptor(path))
        .then(async (desc) => {
          const metadataPath = `${desc.path}.metadata` as const

          if (await driver.checkFileExists(metadataPath)) {
            const metadataStream = await driver.getFile(metadataPath)

            const metadata = await new Promise<string>((resolve, reject) => {
              const body = []

              metadataStream
                .on("data", (chunk) => body.push(chunk))
                .on("error", reject)
                .on("end", () => resolve(Buffer.concat(body).toString("utf8")))
            })

            try {
              desc.metadata = JSON.parse(metadata || "{}")
            } catch (e) {
              logger.error(GET_TAG, e, metadata)
              desc.metadata = {}
            }
          }

          return desc
        })
        .then(OrdoFile.raw),
    getFileContent: (path) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoFile.isValidPath(path)) {
            logger.warn(GET_CONTENT_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) => driver.checkFileExists(path))
        .then((exists) => {
          if (!exists) {
            logger.warn(GET_CONTENT_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then(driver.getFile),
    moveFile: ({ oldPath, newPath }) =>
      Promise.resolve({ oldPath, newPath })
        .then(({ oldPath, newPath }) => {
          if (!OrdoFile.isValidPath(oldPath) || !OrdoFile.isValidPath(newPath)) {
            logger.warn(MOVE_TAG, "Invalid path", { oldPath, newPath })
            throw ExceptionResponse.BAD_REQUEST
          }

          return { oldPath, newPath }
        })
        .then(({ oldPath, newPath }) =>
          Promise.all([
            driver.checkFileExists(oldPath),
            driver.checkFileExists(newPath),
            driver.checkDirectoryExists(OrdoFile.getParentPath(newPath)),
          ]),
        )
        .then(([oldFileExists, newFileExists, newFileParentExists]) => {
          if (!oldFileExists) {
            logger.warn(MOVE_TAG, "Not found", oldFileExists)
            throw ExceptionResponse.NOT_FOUND
          }

          if (newFileExists) {
            logger.warn(MOVE_TAG, "Already exists", newFileExists)
            throw ExceptionResponse.CONFLICT
          }

          return { oldPath, newPath, newFileParentExists }
        })
        .then(async ({ oldPath, newPath, newFileParentExists }) => {
          const parentDirectory = !newFileParentExists
            ? await OrdoDirectoryModel.of({ driver, logger }).createDirectory(
                OrdoFile.getParentPath(newPath),
              )
            : null

          return { oldPath, newPath, parentDirectory }
        })
        .then(async ({ oldPath, newPath, parentDirectory }) => {
          const file = await driver.moveFile({ oldPath, newPath })

          const oldMetadataPath = `${oldPath}.metadata` as const
          const newMetadataPath = `${newPath}.metadata` as const

          if (await driver.checkFileExists(oldMetadataPath)) {
            await driver.moveFile({
              oldPath: oldMetadataPath,
              newPath: newMetadataPath,
            })
          }

          return { file, parentDirectory }
        })
        .then(async ({ file, parentDirectory }) => {
          const result = await (parentDirectory
            ? OrdoDirectoryModel.of({ driver, logger }).getDirectory(parentDirectory.path)
            : driver.getFileDescriptor(file).then(OrdoFile.raw))

          logger.debug(MOVE_TAG, result.path)

          return result
        }),
    updateFile: ({ path, content }) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoFile.isValidPath(path)) {
            logger.warn(UPDATE_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) => driver.checkFileExists(path))
        .then((exists) => {
          if (!exists) {
            logger.warn(UPDATE_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then(async (exists) => {
          if (!exists) {
            await OrdoFileModel.of({ driver, logger }).createFile({ path })
          }

          return driver.updateFile({ path, content })
        })
        .then((path) => {
          logger.debug(UPDATE_TAG, path)

          return driver.getFileDescriptor(path)
        })
        .then(OrdoFile.raw),
  }),
}
