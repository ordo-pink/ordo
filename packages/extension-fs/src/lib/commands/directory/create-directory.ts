import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const createDirectory = ({ logger, payload: path }: CommandContext<OrdoDirectoryPath>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  if (!drive || !driver) return

  driver?.directories
    .create(path)
    .then((raw) => {
      const draft = createDraft(drive)

      const parent = OrdoDirectory.findParent(raw.path, draft.root)

      if (!parent) throw new Error("Cannot find parent of the created file")

      parent.children.push(OrdoDirectory.from(raw))

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      drive$.next(newDrive)
    })
    .catch(logger.error)
}
