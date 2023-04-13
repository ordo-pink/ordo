import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const removeFile = ({ logger, payload }: CommandContext<IOrdoFile>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const parent = OrdoFile.findParent(payload.path, draft.root)

  if (!parent) throw new Error("Could not find parent of the directory being removed")

  parent.children = parent.children.filter((child) => child.path !== payload.path)

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.files
    .remove(payload.path)
    .then(() => {
      emit("fs.remove-file.complete", payload)
    })
    .catch((error) => {
      logger.error(error)

      parent.children.push(payload)
      const revertDrive = finishDraft(draft)
      drive$.next(revertDrive)

      emit("fs.remove-file.error", error)
    })
}
