import { CommandContext, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const moveFile = ({
  logger,
  payload: { oldPath, newPath },
}: CommandContext<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()

  if (!driver || !drive) return

  driver.files
    .move({ oldPath, newPath })
    .then((raw) => {
      const draft = createDraft(drive)

      const oldParent = OrdoFile.findParent(oldPath, draft.root)
      const newParent = OrdoFile.findParent(raw.path, draft.root)

      if (!oldParent) throw new Error("Could not find parent of the file to be moved")
      if (!newParent) throw new Error("Target parent does not exist")

      oldParent.children = oldParent.children.filter((child) => child.path !== oldPath)
      newParent.children.push(
        OrdoDirectory.isOrdoDirectoryRaw(raw) ? OrdoDirectory.from(raw) : OrdoFile.from(raw),
      )

      const newDrive = finishDraft(draft)
      drive$.next(newDrive)
    })
    .catch(logger.error)
}
