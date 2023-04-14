import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { drive$ } from "@ordo-pink/stream-drives"

export const clearTrashBin = () => {
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive) return

  const trash = OrdoDirectory.findDirectoryDeep("/.trash/", drive.root)

  trash && emit("fs.remove-directory", trash)
}
