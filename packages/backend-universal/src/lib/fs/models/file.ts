import { ExceptionResponse } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { OrdoDirectoryModel } from "./directory"
import { FSDriver, IOrdoFileModel } from "../../types"

export const OrdoFileModel = {
  of: (driver: FSDriver): IOrdoFileModel => ({
    checkFileExists: driver.checkFileExists,
    createFile: ({ path, content }) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoFile.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) =>
          Promise.all([
            driver.checkFileExists(path),
            driver.checkDirectoryExists(OrdoFile.getParentPath(path)),
          ]),
        )
        .then(([fileExists, parentDirectoryExists]) =>
          fileExists ? Promise.reject(ExceptionResponse.CONFLICT) : { path, parentDirectoryExists },
        )
        .then(async ({ path, parentDirectoryExists }) => {
          const parentDirectory = !parentDirectoryExists
            ? await OrdoDirectoryModel.of(driver).createDirectory(OrdoFile.getParentPath(path))
            : null

          return { path, parentDirectory }
        })
        .then(async ({ path, parentDirectory }) => {
          await driver.createFile({ path, content })

          return parentDirectory
            ? OrdoDirectoryModel.of(driver).getDirectory(parentDirectory.path)
            : OrdoFileModel.of(driver).getFile(path)
        }),
    deleteFile: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoFile.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) => driver.checkFileExists(path))
        .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
        .then(OrdoFileModel.of(driver).getFile)
        .then(async (file) => {
          await driver.deleteFile(file.path)

          const metadataPath = `${file.path}.metadata` as const

          if (await driver.checkFileExists(metadataPath)) {
            await driver.deleteFile(metadataPath)
          }

          return file
        }),
    getFile: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoFile.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) => driver.checkFileExists(path))
        .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
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

            desc.metadata = JSON.parse(metadata)
          }

          return desc
        })
        .then(OrdoFile.raw),
    getFileContent: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoFile.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) => driver.checkFileExists(path))
        .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
        .then(driver.getFile),
    moveFile: ({ oldPath, newPath }) =>
      Promise.resolve({ oldPath, newPath })
        .then(({ oldPath, newPath }) =>
          OrdoFile.isValidPath(oldPath) && OrdoFile.isValidPath(newPath)
            ? Promise.resolve({ oldPath, newPath })
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then(({ oldPath, newPath }) =>
          Promise.all([
            driver.checkFileExists(oldPath),
            driver.checkFileExists(newPath),
            driver.checkDirectoryExists(OrdoFile.getParentPath(newPath)),
          ]),
        )
        .then(([oldFileExists, newFileExists, newFileParentExists]) =>
          newFileExists
            ? Promise.reject(ExceptionResponse.CONFLICT)
            : !oldFileExists
            ? Promise.reject(ExceptionResponse.NOT_FOUND)
            : { oldPath, newPath, newFileParentExists },
        )
        .then(async ({ oldPath, newPath, newFileParentExists }) => {
          const parentDirectory = !newFileParentExists
            ? await OrdoDirectoryModel.of(driver).createDirectory(OrdoFile.getParentPath(newPath))
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
        .then(({ file, parentDirectory }) =>
          parentDirectory
            ? OrdoDirectoryModel.of(driver).getDirectory(parentDirectory.path)
            : driver.getFileDescriptor(file).then(OrdoFile.raw),
        ),
    updateFile: ({ path, content }) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoFile.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) => driver.checkFileExists(path))
        .then((exists) =>
          exists ? { path, content } : Promise.reject(ExceptionResponse.NOT_FOUND),
        )
        .then(({ path, content }) => driver.updateFile({ path, content }))
        .then((path) => driver.getFileDescriptor(path))
        .then(OrdoFile.raw),
  }),
}
