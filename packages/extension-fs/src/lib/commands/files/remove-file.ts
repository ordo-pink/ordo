import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const removeFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!drive || !driver) return

  const draft = createDraft(drive)
  const parent = OrdoFile.findParent(payload.path, draft.root)

  if (!parent) throw new Error("Could not find parent of the directory being removed")

  parent.children = parent.children.filter((child) => child.path !== payload.path)

  if (!parent.metadata.childOrder) {
    parent.metadata.childOrder = parent.children.map((child) => child.readableName)
  }

  const childOrderIndex = parent.metadata.childOrder.indexOf(payload.readableName)
  parent.metadata.childOrder.splice(childOrderIndex, 1)

  emit("fs.update-directory", OrdoDirectory.from(parent))

  const newDrive = finishDraft(draft)

  setDrive(newDrive)

  driver.files
    .remove(payload.path)
    .then(() => {
      emit("fs.remove-file.complete", payload)
    })
    .catch((error) => {
      parent.children.push(payload)

      parent.metadata.childOrder?.splice(childOrderIndex, 0, payload.readableName)
      emit("fs.update-directory", OrdoDirectory.from(parent))

      setDrive(finishDraft(draft))

      emit("fs.remove-file.error", error)
    })
}
