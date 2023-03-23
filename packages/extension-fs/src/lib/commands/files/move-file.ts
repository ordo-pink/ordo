import { CommandContext, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const moveFile = ({
  logger,
  payload: { oldPath, newPath },
}: CommandContext<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("createFile invoked", { oldPath, newPath })

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    driver?.files
      .move({ oldPath, newPath })
      .then((raw) => {
        const oldParent = OrdoFile.findParent(oldPath, draft.root)
        const newParent = OrdoFile.findParent(raw.path, draft.root)

        if (!oldParent) throw new Error("Could not find parent of the file to be moved")
        if (!newParent) throw new Error("Target parent does not exist")

        oldParent.children = oldParent.children.filter((child) => child.path === oldPath)
        newParent.children.push(
          OrdoDirectory.isOrdoDirectoryRaw(raw) ? OrdoDirectory.from(raw) : OrdoFile.from(raw),
        )
      })
      .catch(logger.error)
  })

  drive$.next(nextDrive)
}
