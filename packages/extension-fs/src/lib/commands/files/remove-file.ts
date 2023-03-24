import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const removeFile = ({ logger, payload }: CommandContext<IOrdoFile>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const parent = OrdoFile.findParent(payload.path, draft.root)

  if (!parent) throw new Error("Could not find parent of the directory being removed")

  parent.children = parent.children.filter((child) => child.path !== payload.path)

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.files.remove(payload.path).catch(logger.error)
}
