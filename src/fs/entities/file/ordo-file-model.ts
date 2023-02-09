import { OrdoFile } from "./ordo-file"
import { Exception } from "../../constants"
import { FSDriver, IOrdoFileModel } from "../../types"
import { OrdoDirectoryModel } from "../directory"

export const OrdoFileModel = (driver: FSDriver): IOrdoFileModel => ({
  createFile: ({ path, content }) =>
    Promise.all([
      driver.checkFileExists(path),
      driver.checkDirectoryExists(OrdoFile.getParentPath(path)),
    ])
      .then(([fileExists, parentDirectoryExists]) =>
        fileExists ? Promise.reject(Exception.CONFLICT) : { path, parentDirectoryExists },
      )
      .then(async ({ path, parentDirectoryExists }) => {
        const parentDirectory = !parentDirectoryExists
          ? await OrdoDirectoryModel(driver).createDirectory(OrdoFile.getParentPath(path))
          : null

        return { path, parentDirectory }
      })
      .then(async ({ path, parentDirectory }) => {
        await driver.createFile({ path, content })

        return parentDirectory
          ? OrdoDirectoryModel(driver).getDirectory(parentDirectory.path)
          : OrdoFileModel(driver).getFile(path)
      }),
  deleteFile: (path) =>
    driver
      .checkFileExists(path)
      .then((exists) => (exists ? path : Promise.reject(Exception.NOT_FOUND)))
      .then(OrdoFileModel(driver).getFile)
      .then(async (file) => {
        await driver.deleteFile(file.path)

        return file
      }),
  exists: driver.checkFileExists,
  getFile: (path) => driver.getFileDescriptor(path).then(OrdoFile.of),
  getFileContent: (path) =>
    driver
      .checkFileExists(path)
      .then((exists) => (exists ? path : Promise.reject(Exception.NOT_FOUND)))
      .then(driver.getFile),
  moveFile: ({ oldPath, newPath }) =>
    Promise.all([
      driver.checkFileExists(oldPath),
      driver.checkFileExists(newPath),
      driver.checkDirectoryExists(OrdoFile.getParentPath(newPath)),
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
          ? await OrdoDirectoryModel(driver).createDirectory(OrdoFile.getParentPath(newPath))
          : null

        return { oldPath, newPath, parentDirectory }
      })
      .then(async ({ oldPath, newPath, parentDirectory }) => ({
        file: await driver.moveFile({ oldPath, newPath }),
        parentDirectory,
      }))
      .then(({ file, parentDirectory }) =>
        parentDirectory
          ? OrdoDirectoryModel(driver).getDirectory(parentDirectory.path)
          : driver.getFileDescriptor(file).then(OrdoFile.of),
      ),
  updateFile: ({ path, content }) =>
    driver
      .checkFileExists(path)
      .then((exists) => (exists ? { path, content } : Promise.reject(Exception.NOT_FOUND)))
      .then(({ path, content }) => driver.updateFile({ path, content }))
      .then((path) => driver.getFileDescriptor(path))
      .then(OrdoFile.of),
})
