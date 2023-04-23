import { Readable } from "stream"
import { IOrdoDirectoryRaw, SystemDirectory } from "@ordo-pink/common-types"
import { IOrdoInternal, OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FSDriver, IOrdoDirectoryModel, IOrdoInternalModel } from "../../types"

type IOrdoInternalModelParams = {
  fsDriver: FSDriver
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
  of: ({ fsDriver, directory }: IOrdoInternalModelParams): IOrdoInternalModel => {
    return {
      getInternalValue: (userId, key) =>
        OrdoInternalModel.of({ fsDriver, directory })
          .getValues(userId)
          .then((internal: IOrdoInternal) => internal[key]),
      setInternalValue: (userId, key, value) =>
        OrdoInternalModel.of({ fsDriver, directory })
          .getValues(userId)
          .then(async (internal: IOrdoInternal) => {
            const path = `/${userId}${SystemDirectory.INTERNAL}ordo.json` as const

            const internalCopy = { ...internal }

            internalCopy[key] = value

            const content = Readable.from(JSON.stringify(internalCopy))

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
              const rootDir = await directory.getDirectory({
                path: `/${userId}/`,
                issuerId: userId,
              })
              const totalSize = reduceDirectoryToSize(rootDir)

              const payload: IOrdoInternal = {
                totalSize, // TODO: Store externally
              }

              const content = Readable.from(JSON.stringify(payload))

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
          .then((content) => JSON.parse(content || "{}") as IOrdoInternal)
      },
    }
  },
}
