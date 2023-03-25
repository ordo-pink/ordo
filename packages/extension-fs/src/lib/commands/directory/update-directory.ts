import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const updateDirectory = ({ logger, payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const directory = OrdoDirectory.findDirectoryDeep(payload.path, draft.root)

  if (!directory) throw new Error("Could not find directory that needs an update")

  directory.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.directories.set(payload).catch(logger.error)
}
