import { Readable } from "stream"
import { SystemDirectory } from "@ordo-pink/common-types"
import { IOrdoInternal } from "@ordo-pink/fs-entity"
import { FSDriver, IOrdoInternalModel, StorageLimits } from "../../types"

export const OrdoInternalModel = {
  of: (driver: FSDriver, limits: StorageLimits): IOrdoInternalModel => {
    const { maxTotalSize, maxUploadSize } = limits

    if (Number.isNaN(maxUploadSize) || maxUploadSize <= 0) {
      throw new Error("Max upload size is invalid")
    }

    if (Number.isNaN(maxTotalSize) || maxTotalSize <= 0) {
      throw new Error("Max total size is invalid")
    }

    return {
      getInternalValue: (userId, key) =>
        OrdoInternalModel.of(driver, limits)
          .getValues(userId)
          .then((internal: IOrdoInternal) => internal[key]),
      setInternalValue: (userId, key, value) =>
        OrdoInternalModel.of(driver, limits)
          .getValues(userId)
          .then(async (internal: IOrdoInternal) => {
            const path = `/${userId}${SystemDirectory.INTERNAL}ordo.json` as const

            const internalCopy = { ...internal }

            internalCopy[key] = value

            const content = new Readable()

            content.push(JSON.stringify(internalCopy))
            content.push(null)

            await driver.updateFile({ path, content })
          }),
      getValues: (userId) => {
        const path = `/${userId}${SystemDirectory.INTERNAL}ordo.json` as const

        return driver
          .checkFileExists(path)
          .then(async (exists) => {
            if (!exists) {
              const content = new Readable()

              const payload: IOrdoInternal = {
                maxTotalSize: maxTotalSize,
                maxUploadSize: maxUploadSize,
                totalSize: 0,
              }

              content.push(JSON.stringify(payload))
              content.push(null)

              await driver.createFile({ path, content })
            }

            return path
          })
          .then(driver.getFile)
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
