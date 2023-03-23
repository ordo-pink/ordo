import { ExceptionResponse, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { OrdoFileModel } from "./file"
import { FSDriver, IOrdoDirectoryModel } from "../../types"

export const OrdoDirectoryModel = {
  of: (driver: FSDriver): IOrdoDirectoryModel => ({
    checkDirectoryExists: driver.checkDirectoryExists,
    createDirectory: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoDirectory.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) =>
          Promise.all([
            driver.checkDirectoryExists(path),
            driver.checkDirectoryExists(OrdoDirectory.getParentPath(path)),
          ]),
        )
        .then(([directoryExists, parentDirectoryExists]) =>
          directoryExists
            ? Promise.reject(ExceptionResponse.CONFLICT)
            : { path, parentDirectoryExists },
        )
        .then(async ({ path, parentDirectoryExists }) => {
          if (OrdoDirectory.getParentPath(path) === "/" && !parentDirectoryExists) {
            await driver.createDirectory("/")
            parentDirectoryExists = true
          }

          const parentDirectory = !parentDirectoryExists
            ? await OrdoDirectoryModel.of(driver).createDirectory(OrdoDirectory.getParentPath(path))
            : null

          return { path, parentDirectory }
        })
        .then(async ({ path, parentDirectory }) => {
          await driver.createDirectory(path)

          return parentDirectory
            ? OrdoDirectoryModel.of(driver).getDirectory(parentDirectory.path)
            : OrdoDirectoryModel.of(driver).getDirectory(path)
        }),
    deleteDirectory: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoDirectory.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then(driver.checkDirectoryExists)
        .then((exists) =>
          /^\/[a-z0-9-]+\/$/i.test(path) ? Promise.reject(ExceptionResponse.CONFLICT) : exists,
        )
        .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
        .then(() => OrdoDirectory.raw({ path, children: [] }))
        .then(async (directory) => {
          await driver.deleteDirectory(directory.path)

          return directory
        }),
    getDirectory: (path) =>
      Promise.resolve(path)
        .then((path) =>
          OrdoDirectory.isValidPath(path)
            ? Promise.resolve(path)
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then((path) => driver.checkDirectoryExists(path))
        .then(async (exists) => {
          if (/^\/[a-z0-9-]+\/$/i.test(path) && !exists) {
            await driver.createDirectory(path)

            return true
          }

          return exists
        })
        .then((exists) => (exists ? path : Promise.reject(ExceptionResponse.NOT_FOUND)))
        .then(driver.getDirectoryChildren)
        .then(async (children) => {
          const result = []

          for (const path of children) {
            if (OrdoDirectory.isValidPath(path)) {
              result.push(
                await OrdoDirectoryModel.of(driver).getDirectory(path as OrdoDirectoryPath),
              )
            } else if (OrdoFile.isValidPath(path) && !path.endsWith(".metadata")) {
              result.push(await OrdoFileModel.of(driver).getFile(path as OrdoFilePath))
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

            directory.metadata = JSON.parse(metadata)
          }

          return directory
        }),
    moveDirectory: ({ oldPath, newPath }) =>
      Promise.resolve({ oldPath, newPath })
        .then(({ oldPath, newPath }) =>
          OrdoDirectory.isValidPath(oldPath) && OrdoDirectory.isValidPath(newPath)
            ? Promise.resolve({ oldPath, newPath })
            : Promise.reject(ExceptionResponse.BAD_REQUEST),
        )
        .then(({ oldPath, newPath }) =>
          Promise.all([
            driver.checkDirectoryExists(oldPath),
            driver.checkDirectoryExists(newPath),
            driver.checkDirectoryExists(OrdoDirectory.getParentPath(newPath)),
          ]),
        )
        .then(([oldDirectoryExists, newDirectoryExists, newDirectoryParentExists]) =>
          newDirectoryExists || oldPath === newPath
            ? Promise.reject(ExceptionResponse.CONFLICT)
            : !oldDirectoryExists
            ? Promise.reject(ExceptionResponse.NOT_FOUND)
            : { oldPath, newPath, newDirectoryParentExists },
        )
        .then(async ({ oldPath, newPath, newDirectoryParentExists }) => {
          const parentDirectory = !newDirectoryParentExists
            ? await OrdoDirectoryModel.of(driver).createDirectory(
                OrdoDirectory.getParentPath(newPath),
              )
            : null

          return { oldPath, newPath, parentDirectory }
        })
        .then(async ({ oldPath, newPath, parentDirectory }) => ({
          directory: await driver.moveDirectory({ oldPath, newPath }),
          parentDirectory,
        }))
        .then(({ directory, parentDirectory }) =>
          parentDirectory
            ? OrdoDirectoryModel.of(driver).getDirectory(parentDirectory.path)
            : OrdoDirectoryModel.of(driver).getDirectory(directory),
        ),
  }),
}
