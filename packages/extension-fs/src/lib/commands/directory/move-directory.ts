import { CommandContext, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const moveDirectory = ({
  payload: { oldPath, newPath },
}: CommandContext<{ oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath }>) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (oldPath === "/") {
    return emit("fs.move-directory.error", new Error("Cannot move root directory"))
  }

  if (oldPath === "/.trash/") {
    return emit("fs.move-directory.error", new Error("Cannot move trash bin"))
  }

  if (!drive || !driver) return

  driver.directories
    .move({ oldPath, newPath })
    .then((raw) => {
      const draft = createDraft(drive)

      const oldParent = OrdoDirectory.findParent(oldPath, draft.root)
      const newParent = OrdoDirectory.findParent(raw.path, draft.root)

      if (!oldParent) throw new Error("Could not find parent of the directory to be moved")
      if (!newParent) throw new Error("Target parent does not exist")

      const directory = OrdoDirectory.from(raw)

      oldParent.children = oldParent.children.filter((child) => child.path !== oldPath)

      newParent.children.push(directory)

      if (oldParent.path === newParent.path) {
        if (oldParent.metadata.childOrder) {
          oldParent.metadata.childOrder.splice(
            oldParent.metadata.childOrder.indexOf(oldPath),
            1,
            raw.path,
          )

          emit("fs.update-directory", OrdoDirectory.from(oldParent))
        }
      } else {
        let oldParentChildIndex: Nullable<number> = null

        if (oldParent.metadata.childOrder) {
          oldParentChildIndex = oldParent.metadata.childOrder.indexOf(oldPath)
          oldParent.metadata.childOrder.splice(oldParentChildIndex, 1)
          emit("fs.update-directory", OrdoDirectory.from(oldParent))
        }

        if (newParent.metadata.childOrder) {
          oldParentChildIndex != null
            ? newParent.metadata.childOrder.splice(oldParentChildIndex, 0, raw.path)
            : newParent.metadata.childOrder.push(raw.path)
          emit("fs.update-directory", OrdoDirectory.from(newParent))
        }
      }

      OrdoDirectory.sort(newParent.children)

      const newDrive = finishDraft(draft)

      setDrive(newDrive)

      emit("fs.move-directory.complete", { oldPath, newPath })
    })
    .catch((error) => emit("fs.move-directory.error", error))
}
