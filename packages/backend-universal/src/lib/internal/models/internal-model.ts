import { Readable } from "stream"
import { IOrdoDirectoryRaw, SystemDirectory } from "@ordo-pink/common-types"
import { IOrdoInternal, OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FSDriver, IOrdoDirectoryModel, IOrdoInternalModel, StorageLimits } from "../../types"

type IOrdoInternalModelParams = {
  fsDriver: FSDriver
  limits: StorageLimits
  directory: IOrdoDirectoryModel
}

const reduceDirectoryToSize = (directory: IOrdoDirectoryRaw, totalSize = 0) =>
  directory.children.reduce((acc, child) => {
    if (OrdoDirectory.isOrdoDirectoryRaw(child))
      return acc + reduceDirectoryToSize(child, totalSize)
    if (OrdoFile.isOrdoFileRaw(child)) return acc + child.size

    return acc
  }, totalSize)

export const OrdoInternalModel = {
  of: ({ fsDriver, limits, directory }: IOrdoInternalModelParams): IOrdoInternalModel => {
    const { maxTotalSize, maxUploadSize } = limits

    if (Number.isNaN(maxUploadSize) || maxUploadSize <= 0) {
      throw new Error("Max upload size is invalid")
    }

    if (Number.isNaN(maxTotalSize) || maxTotalSize <= 0) {
      throw new Error("Max total size is invalid")
    }

    return {
      getInternalValue: (userId, key) =>
        OrdoInternalModel.of({ fsDriver: fsDriver, limits, directory: directory })
          .getValues(userId)
          .then((internal: IOrdoInternal) => internal[key]),
      setInternalValue: (userId, key, value) =>
        OrdoInternalModel.of({ fsDriver: fsDriver, limits, directory: directory })
          .getValues(userId)
          .then(async (internal: IOrdoInternal) => {
            const path = `/${userId}${SystemDirectory.INTERNAL}ordo.json` as const

            const internalCopy = { ...internal }

            internalCopy[key] = value

            const content = new Readable()

            content.push(JSON.stringify(internalCopy))
            content.push(null)

            await fsDriver.updateFile({ path, content })
          }),
      getValues: (userId) => {
        const parent = `/${userId}${SystemDirectory.INTERNAL}` as const
        const path = `${parent}ordo.json` as const

        return fsDriver
          .checkDirectoryExists(parent)
          .then(async (exists) => {
            if (!exists) {
              await fsDriver.createDirectory(parent)

              return false
            }

            return fsDriver.checkFileExists(path)
          })
          .then(async (exists) => {
            if (!exists) {
              const content = new Readable()

              const rootDir = await directory.getDirectory(`/${userId}/`)
              const totalSize = reduceDirectoryToSize(rootDir)

              const payload: IOrdoInternal = {
                maxTotalSize: maxTotalSize,
                maxUploadSize: maxUploadSize,
                totalSize,
              }

              content.push(JSON.stringify(payload))
              content.push(null)

              await fsDriver.createFile({ path, content })
            }

            return path
          })
          .then(fsDriver.getFile)
          .then(
            (content) =>
              new Promise<string>((resolve, reject) => {
                const body = []

                content
                  .on("data", (chunk) => body.push(chunk))
                  .on("error", reject)
                  .on("end", () => resolve(Buffer.concat(body).toString("utf8")))
              }),
          )
          .then((content) => JSON.parse(content) as IOrdoInternal)
      },
    }
  },
}
