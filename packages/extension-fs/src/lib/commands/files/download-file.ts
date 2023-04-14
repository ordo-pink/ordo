import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldFsDriver } from "@ordo-pink/react-utils"

export const downloadFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const driver = wieldFsDriver()

  if (!driver) return

  driver.files
    .getContent(payload.path)
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => {
      const a = document.createElement("a")

      a.href = url
      a.download = `${payload.readableName}${payload.extension}`
      document.body.appendChild(a)

      a.click()

      // TODO: Check if it actually works!
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
    })
}
