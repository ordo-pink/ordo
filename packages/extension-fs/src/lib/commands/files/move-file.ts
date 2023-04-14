import { CommandHandler, Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const moveFile: CommandHandler<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }> = ({
  payload: { oldPath, newPath },
}) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!driver || !drive) return

  driver.files
    .move({ oldPath, newPath })
    .then((raw) => {
      const draft = createDraft(drive)

      const oldParent = OrdoFile.findParent(oldPath, draft.root)
      const newParent = OrdoFile.findParent(raw.path, draft.root)

      if (!oldParent) throw new Error("Could not find parent of the file to be moved")
      if (!newParent) throw new Error("Target parent does not exist")

      const result = OrdoDirectory.isOrdoDirectoryRaw(raw)
        ? OrdoDirectory.from(raw)
        : OrdoFile.from(raw)

      oldParent.children = oldParent.children.filter((child) => child.path !== oldPath)
      newParent.children.push(result)

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

      OrdoDirectory.sort(newParent.children)

      const newDrive = finishDraft(draft)

      setDrive(newDrive)

      emit("fs.update-directory", oldParent)
      emit("fs.update-directory", newParent)
      emit("fs.move-file.complete", { oldPath, newPath })
    })
    .catch((error) => {
      emit("fs.move-file.error", error)
    })
}
