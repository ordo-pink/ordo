import { OrdoDirectory } from "./ordo-directory"
import { Exception } from "../../constants"
import { FSDriver, IOrdoDirectoryModel, OrdoDirectoryPath, OrdoFilePath } from "../../types"
import { OrdoFile, OrdoFileModel } from "../file"

export const OrdoDirectoryModel = (driver: FSDriver): IOrdoDirectoryModel => ({
  createDirectory: (path) => {
    return Promise.all([
      driver.checkDirectoryExists(path),
      driver.checkDirectoryExists(OrdoDirectory.getParentPath(path)),
    ])
      .then(([fileExists, parentDirectoryExists]) =>
        fileExists ? Promise.reject(Exception.CONFLICT) : { path, parentDirectoryExists },
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
      .checkFileExists(path)
      .then((exists) => (exists ? path : Promise.reject(Exception.NOT_FOUND)))
      .then(() => OrdoDirectory.of({ path, children: [] }))
      .then(async (directory) => {
        await driver.deleteDirectory(directory.path)

        return directory
      }),
  exists: driver.checkFileExists,
  getDirectory: (path) =>
    driver
      .checkDirectoryExists(path)
      .then((exists) => (exists ? path : Promise.reject(Exception.NOT_FOUND)))
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
      .then((children) => OrdoDirectory.of({ path, children })),
  moveDirectory: ({ oldPath, newPath }) =>
    Promise.all([
      driver.checkDirectoryExists(oldPath),
      driver.checkDirectoryExists(newPath),
      driver.checkDirectoryExists(OrdoDirectory.getParentPath(newPath)),
    ])
      .then(([oldFileExists, newFileExists, newFileParentExists]) =>
        newFileExists
          ? Promise.reject(Exception.CONFLICT)
          : !oldFileExists
          ? Promise.reject(Exception.NOT_FOUND)
          : { oldPath, newPath, newFileParentExists },
      )
      .then(async ({ oldPath, newPath, newFileParentExists }) => {
        const parentDirectory = !newFileParentExists
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
