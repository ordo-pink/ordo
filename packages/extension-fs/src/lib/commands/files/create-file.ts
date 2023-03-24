import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const createFile: CommandHandler<{ file: IOrdoFile; content?: string }> = ({
  logger,
  payload: { file, content = "" },
}) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  if (!drive || !driver) return

  driver?.files
    .create({ file, content })
    .then((raw) => {
      const draft = createDraft(drive)

      const parent = OrdoFile.findParent(raw.path, draft.root)

      if (!parent) throw new Error("Cannot find parent of the created file")

      parent.children.push(
        OrdoDirectory.isOrdoDirectoryRaw(raw) ? OrdoDirectory.from(raw) : OrdoFile.from(raw),
      )

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      drive$.next(newDrive)
    })
    .catch(logger.error)
}
