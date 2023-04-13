import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const removeDirectory = ({ logger, payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const parent = OrdoDirectory.findParent(payload.path, draft.root)

  if (!parent) throw new Error("Could not find parent of the directory being removed")

  parent.children = parent.children.filter((child) => child.path !== payload.path)

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.directories
    .remove(payload.path)
    .then(() => {
      emit("fs.remove-directory.complete", payload)
    })
    .catch((error) => {
      logger.error(error)

      parent.children.push(payload)
      const revertDrive = finishDraft(draft)
      drive$.next(revertDrive)

      emit("fs.remove-directory.error", error)
    })
}
