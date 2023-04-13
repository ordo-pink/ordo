import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const moveDirectory = ({
  logger,
  payload: { oldPath, newPath },
}: CommandContext<{ oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath }>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  driver.directories
    .move({ oldPath, newPath })
    .then((raw) => {
      const draft = createDraft(drive)

      const oldParent = OrdoDirectory.findParent(oldPath, draft.root)
      const newParent = OrdoDirectory.findParent(raw.path, draft.root)

      if (!oldParent) throw new Error("Could not find parent of the directory to be moved")
      if (!newParent) throw new Error("Target parent does not exist")

      const directory = OrdoDirectory.from(raw)

      oldParent.children = oldParent.children.filter((child) => child.path !== oldPath)
      newParent?.children.push(directory)

      OrdoDirectory.sort(newParent.children)

      const newDrive = finishDraft(draft)

      drive$.next(newDrive)

      emit("fs.move-directory.complete", directory)
    })
    .catch((error) => {
      logger.error(error)

      emit("fs.move-directory.error", error)
    })
}
