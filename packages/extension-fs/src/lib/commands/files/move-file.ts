import { CommandHandler, OrdoFilePath } from "@ordo-pink/common-types"
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

      const result = OrdoDirectory.isOrdoDirectory(raw) ? OrdoDirectory.of(raw) : OrdoFile.of(raw)

      if (!oldParent.metadata.childOrder) {
        oldParent.metadata.childOrder = oldParent.children.map((child) => child.readableName)
      }

      if (oldParent.path === newParent.path) {
        oldParent.metadata.childOrder.splice(
          oldParent.metadata.childOrder.indexOf(OrdoFile.getReadableName(oldPath)),
          1,
          result.readableName,
        )

        emit("fs.update-directory", OrdoDirectory.from(oldParent))
      } else {
        if (!newParent.metadata.childOrder) {
          newParent.metadata.childOrder = newParent.children.map((child) => child.readableName)
        }

        const oldParentChildIndex = oldParent.metadata.childOrder.indexOf(
          OrdoFile.getReadableName(oldPath),
        )

        oldParent.metadata.childOrder.splice(oldParentChildIndex, 1)
        newParent.metadata.childOrder.splice(oldParentChildIndex, 0, result.readableName)

        emit("fs.update-directory", OrdoDirectory.from(oldParent))
        emit("fs.update-directory", OrdoDirectory.from(newParent))
      }

      oldParent.children = oldParent.children.filter((child) => child.path !== oldPath)
      newParent.children.push(result)

      OrdoDirectory.sort(newParent.children)

      const newDrive = finishDraft(draft)

      setDrive(newDrive)

      emit("fs.move-file.complete", { oldPath, newPath })
    })
    .catch((error) => {
      emit("fs.move-file.error", error)
    })
}
