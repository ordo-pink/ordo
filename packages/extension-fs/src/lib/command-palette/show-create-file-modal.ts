import { useCommands } from "@ordo-pink/react-utils"
import { drive$ } from "@ordo-pink/stream-drives"

export const handleShowCreateFileModalCommandPalette = () => {
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  emit("fs.show-create-file-modal", { parent: drive.root, openInEditor: true })
}
