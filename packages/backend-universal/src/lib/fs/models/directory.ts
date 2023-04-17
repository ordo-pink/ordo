import { Readable } from "stream"
import { ExceptionResponse, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { Logger } from "@ordo-pink/logger"
import { OrdoFileModel } from "./file"
import { FSDriver, IOrdoDirectoryModel } from "../../types"

type InitParams = {
  driver: FSDriver
  logger: Logger
}

const CREATE_TAG = "OrdoDirectoryModel::createDirectory"
const REMOVE_TAG = "OrdoDirectoryModel::deleteDirectory"
const MOVE_TAG = "OrdoDirectoryModel::moveDirectory"
const GET_TAG = "OrdoDirectoryModel::getDirectory"

export const OrdoDirectoryModel = {
  of: ({ driver, logger }: InitParams): IOrdoDirectoryModel => ({
    checkDirectoryExists: driver.checkDirectoryExists,
    createDirectory: ({ path, issuerId }) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoDirectory.isValidPath(path)) {
            logger.warn(CREATE_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) =>
          Promise.all([
            driver.checkDirectoryExists(path),
            driver.checkDirectoryExists(OrdoDirectory.getParentPath(path)),
          ]),
        )
        .then(([directoryExists, parentDirectoryExists]) => {
          if (directoryExists) {
            logger.warn(CREATE_TAG, "Already exists", path)
            throw ExceptionResponse.CONFLICT
          }

          return { path, parentDirectoryExists }
        })
        .then(async ({ path, parentDirectoryExists }) => {
          const parentDirectory = !parentDirectoryExists
            ? await OrdoDirectoryModel.of({ driver, logger }).createDirectory({
                path: OrdoDirectory.getParentPath(path),
                issuerId,
              })
            : null

          return { path, parentDirectory }
        })
        .then(async ({ path, parentDirectory }) => {
          await driver.createDirectory(path)

          if (!path.endsWith("/.trash/")) {
            const readable = Readable.from(
              JSON.stringify({
                isExpanded: false,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                createdBy: issuerId,
                updatedBy: issuerId,
                color: "neutral",
              }),
            )

            await driver.createFile({ path: `${path}.metadata`, content: readable })
          }

          const result = parentDirectory
            ? await OrdoDirectoryModel.of({ driver, logger }).getDirectory({
                path: parentDirectory.path,
                issuerId,
              })
            : await OrdoDirectoryModel.of({ driver, logger }).getDirectory({ path, issuerId })

          logger.debug(CREATE_TAG, result)

          return result
        }),
    deleteDirectory: ({ path }) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoDirectory.isValidPath(path)) {
            logger.warn(REMOVE_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then(driver.checkDirectoryExists)
        .then((exists) => {
          if (!exists) {
            logger.warn(REMOVE_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then((path) => {
          if (/^\/[a-z0-9-]+\/$/i.test(path)) {
            logger.warn(REMOVE_TAG, "Cannot remove root", path)
            throw ExceptionResponse.CONFLICT
          }

          return path
        })
        .then(() => OrdoDirectory.raw({ path, children: [] }))
        .then(async (directory) => {
          await driver.deleteDirectory(directory.path)

          logger.debug(REMOVE_TAG, directory.path)

          return directory
        }),
    getDirectory: ({ path, issuerId }) =>
      Promise.resolve(path)
        .then((path) => {
          if (!OrdoDirectory.isValidPath(path)) {
            logger.warn(GET_TAG, "Invalid path", path)
            throw ExceptionResponse.BAD_REQUEST
          }

          return path
        })
        .then((path) => driver.checkDirectoryExists(path))
        .then(async (exists) => {
          if (/^\/[a-z0-9-]+\/$/i.test(path) && !exists) {
            await driver.createDirectory(path)
            logger.info(GET_TAG, "Root directory created", path)

            return true
          }

          return exists
        })
        .then((exists) => {
          if (!exists) {
            logger.warn(GET_TAG, "Not found", path)
            throw ExceptionResponse.NOT_FOUND
          }

          return path
        })
        .then(driver.getDirectoryChildren)
        .then(async (children) => {
          const result = []

          for (const path of children) {
            if (OrdoDirectory.isValidPath(path)) {
              result.push(
                await OrdoDirectoryModel.of({ driver, logger }).getDirectory({
                  path: path as OrdoDirectoryPath,
                  issuerId,
                }),
              )
            } else if (OrdoFile.isValidPath(path) && !path.endsWith(".metadata")) {
              result.push(
                await OrdoFileModel.of({ driver, logger }).getFile({
                  path: path as OrdoFilePath,
                  issuerId,
                }),
              )
            }
          }

          return result
        })
        .then((children) => OrdoDirectory.raw({ path, children, metadata: { isExpanded: true } }))
        .then(async (directory) => {
          const metadataPath = `${directory.path}.metadata` as const

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
              directory.metadata = JSON.parse(metadata || "{}")
            } catch (e) {
              logger.error(GET_TAG, e)
              directory.metadata = {}
            }
          }

          return directory
        }),
    moveDirectory: ({ oldPath, newPath, issuerId }) =>
      Promise.resolve({ oldPath, newPath })
        .then(({ oldPath, newPath }) => {
          if (!OrdoDirectory.isValidPath(oldPath) || !OrdoDirectory.isValidPath(newPath)) {
            logger.warn(MOVE_TAG, "Invalid path", { oldPath, newPath })
            throw ExceptionResponse.BAD_REQUEST
          }

          return { oldPath, newPath }
        })
        .then(({ oldPath, newPath }) =>
          Promise.all([
            driver.checkDirectoryExists(oldPath),
            driver.checkDirectoryExists(newPath),
            driver.checkDirectoryExists(OrdoDirectory.getParentPath(newPath)),
          ]),
        )
        .then(([oldDirectoryExists, newDirectoryExists, newDirectoryParentExists]) => {
          if (!oldDirectoryExists) {
            logger.warn(MOVE_TAG, "Not found", oldDirectoryExists)
            throw ExceptionResponse.NOT_FOUND
          }

          if (newDirectoryExists) {
            logger.warn(MOVE_TAG, "Already exists", newDirectoryExists)
            throw ExceptionResponse.CONFLICT
          }

          return { oldPath, newPath, newDirectoryParentExists }
        })
        .then(async ({ oldPath, newPath, newDirectoryParentExists }) => {
          const metadataPath = `${oldPath}.metadata` as const

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
              const data = JSON.parse(metadata || "{}")
              data.updatedAt = new Date(Date.now())
              data.updatedBy = issuerId

              if (!data.createdAt) data.createdAt = new Date(Date.now())
              if (!data.createdBy) data.createdBy = metadataPath.split("/")[1]

              const readable = Readable.from(JSON.stringify(data))

              await driver.updateFile({ path: metadataPath, content: readable })
            } catch (e) {
              await driver.createFile({
                path: metadataPath,
                content: Readable.from(
                  JSON.stringify({
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now()),
                    createdBy: issuerId,
                    updatedBy: issuerId,
                  }),
                ),
              })
              logger.error(MOVE_TAG, e)
            }
          } else {
            await driver.createFile({
              path: metadataPath,
              content: Readable.from(
                JSON.stringify({
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                  createdBy: issuerId,
                  updatedBy: issuerId,
                }),
              ),
            })
          }

          const parentDirectory = !newDirectoryParentExists
            ? await OrdoDirectoryModel.of({ driver, logger }).createDirectory({
                path: OrdoDirectory.getParentPath(newPath),
                issuerId,
              })
            : null

          return { oldPath, newPath, parentDirectory }
        })
        .then(async ({ oldPath, newPath, parentDirectory }) => ({
          directory: await driver.moveDirectory({ oldPath, newPath }),
          parentDirectory,
        }))
        .then(({ directory, parentDirectory }) => {
          const result = parentDirectory
            ? OrdoDirectoryModel.of({ driver, logger }).getDirectory({
                path: parentDirectory.path,
                issuerId,
              })
            : OrdoDirectoryModel.of({ driver, logger }).getDirectory({ path: directory, issuerId })

          logger.debug(MOVE_TAG, result)

          return result
        }),
  }),
}
