import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const updateFile: CommandHandler<IOrdoFile> = ({ logger, payload }) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()

  if (!driver || !drive) return

  const draft = createDraft(drive)

  const ordoFile = OrdoDirectory.findFileDeep(payload.path, draft.root)

  if (!ordoFile) throw new Error("Could not find file that needs an update")

  ordoFile.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.files.set(payload).catch(logger.error)
}
