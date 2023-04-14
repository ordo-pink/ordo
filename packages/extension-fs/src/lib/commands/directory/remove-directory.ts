import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const removeDirectory = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (payload.path === "/") {
    return emit("fs.remove-directory.error", new Error("Cannot remove root directory"))
  }

  if (payload.path === "/.trash/") {
    return emit("fs.remove-directory.error", new Error("Cannot remove trash bin"))
  }

  if (!drive || !driver) return

  const draft = createDraft(drive)
  const parent = OrdoDirectory.findParent(payload.path, draft.root)

  if (!parent) throw new Error("Could not find parent of the directory being removed")

  parent.children = parent.children.filter((child) => child.path !== payload.path)

  let childOrderIndex: number

  if (parent.metadata.childOrder) {
    childOrderIndex = parent.metadata.childOrder.indexOf(payload.path)
    parent.metadata.childOrder.splice(childOrderIndex, 1)
  }

  const newDrive = finishDraft(draft)

  setDrive(newDrive)

  driver.directories
    .remove(payload.path)
    .then(() => {
      emit("fs.remove-directory.complete", payload)
    })
    .catch((error) => {
      parent.children.push(payload)

      if (childOrderIndex != null) {
        parent.metadata.childOrder?.splice(childOrderIndex, 0, payload.path)
        emit("fs.update-directory", OrdoDirectory.from(parent))
      }

      setDrive(finishDraft(draft))

      emit("fs.remove-directory.error", error)
    })
}
