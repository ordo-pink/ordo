import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const createDirectory = ({ payload: path }: CommandContext<OrdoDirectoryPath>) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!drive || !driver) return

  if (path === "/") {
    return emit("fs.create-directory.error", new Error("Cannot create root directory"))
  }

  if (path === "/.trash/") {
    return emit("fs.create-directory.error", new Error("Cannot create trash bin"))
  }

  driver.directories
    .create(path)
    .then((raw) => {
      const draft = createDraft(drive)
      const parent = OrdoDirectory.findParent(raw.path, draft.root)
      const directory = OrdoDirectory.from(raw)

      if (!parent) throw new Error("Cannot find parent of the created directory")

      parent.children.push(directory)

      if (parent.metadata.childOrder) {
        parent.metadata.childOrder.push(directory.path)
        emit("fs.update-directory", OrdoDirectory.from(parent))
      }

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      setDrive(newDrive)

      emit("fs.create-directory.complete", directory)
    })
    .catch((error) => emit("fs.create-directory.error", error))
}
