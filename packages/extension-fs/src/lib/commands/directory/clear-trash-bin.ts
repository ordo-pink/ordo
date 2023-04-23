import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive } from "@ordo-pink/react-utils"

export const clearTrashBin = () => {
  const [drive] = wieldDrive()
  const { emit } = wieldCommands()

  const trash = drive && OrdoDirectory.findDirectoryDeep("/.trash/", drive.root)

  trash && emit("fs.remove-directory", trash)
}
