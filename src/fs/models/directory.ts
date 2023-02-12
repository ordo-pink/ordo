import {
  ExceptionResponse,
  OrdoDirectory,
  OrdoDirectoryPath,
  OrdoFile,
  OrdoFilePath,
} from "@ordo-pink/core"
import { OrdoFileModel } from "./file"
import { FSDriver, IOrdoDirectoryModel } from "../types"

export const OrdoDirectoryModel = (driver: FSDriver): IOrdoDirectoryModel => ({
  createDirectory: (path) => {
    return Promise.all([
      driver.checkDirectoryExists(path),
      driver.checkDirectoryExists(OrdoDirectory.getParentPath(path)),
    ])
      .then(([directoryExists, parentDirectoryExists]) =>
        directoryExists
          ? Promise.reject(ExceptionResponse.CONFLICT)
          : { path, parentDirectoryExists },
      )
      .then(async ({ path, parentDirectoryExists }) => {
        const parentDirectory = !parentDirectoryExists
          ? await OrdoDirectoryModel(driver).createDirectory(OrdoDirectory.getParentPath(path))
          : null

        return { path, parentDirectory }
      })
      .then(async ({ path, parentDirectory }) => {
        await driver.createDirectory(path)

        return parentDirectory
          ? OrdoDirectoryModel(driver).getDirectory(parentDirectory.path)
          : OrdoDirectoryModel(driver).getDirectory(path)
      })
  },
  deleteDirectory: (path) =>
    driver
      .checkDirectoryExists(path)
      .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
      .then(() => OrdoDirectory.raw({ path, children: [] }))
      .then(async (directory) => {
        await driver.deleteDirectory(directory.path)

        return directory
      }),
  exists: driver.checkFileExists,
  getDirectory: (path) =>
    driver
      .checkDirectoryExists(path)
      .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
      .then(driver.getDirectoryChildren)
      .then(async (children) => {
        const result = []

        for (const path of children) {
          if (OrdoDirectory.isValidPath(path)) {
            result.push(await OrdoDirectoryModel(driver).getDirectory(path as OrdoDirectoryPath))
          } else if (OrdoFile.isValidPath(path)) {
            result.push(await OrdoFileModel(driver).getFile(path as OrdoFilePath))
          }
        }

        return result
      })
      .then((children) => OrdoDirectory.raw({ path, children })),
  moveDirectory: ({ oldPath, newPath }) =>
    Promise.all([
      driver.checkDirectoryExists(oldPath),
      driver.checkDirectoryExists(newPath),
      driver.checkDirectoryExists(OrdoDirectory.getParentPath(newPath)),
    ])
      .then(([oldDirectoryExists, newDirectoryExists, newDirectoryParentExists]) =>
        newDirectoryExists
          ? Promise.reject(ExceptionResponse.CONFLICT)
          : !oldDirectoryExists
          ? Promise.reject(ExceptionResponse.NOT_FOUND)
          : { oldPath, newPath, newDirectoryParentExists },
      )
      .then(async ({ oldPath, newPath, newDirectoryParentExists }) => {
        const parentDirectory = !newDirectoryParentExists
          ? await driver.createDirectory(OrdoDirectory.getParentPath(newPath))
          : null

        return { oldPath, newPath, parentDirectory }
      })
      .then(async ({ oldPath, newPath, parentDirectory }) => ({
        directory: await driver.moveDirectory({ oldPath, newPath }),
        parentDirectory,
      }))
      .then(({ directory, parentDirectory }) =>
        parentDirectory
          ? OrdoDirectoryModel(driver).getDirectory(parentDirectory)
          : OrdoDirectoryModel(driver).getDirectory(directory),
      ),
})
