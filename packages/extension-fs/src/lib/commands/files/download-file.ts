import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { fsDriver$ } from "@ordo-pink/stream-drives"

export const downloadFile = ({ payload }: CommandContext<IOrdoFile>) => {
  const driver = fsDriver$.getValue()

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
