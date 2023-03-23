import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const moveDirectory = ({
  logger,
  payload: { oldPath, newPath },
}: CommandContext<{ oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath }>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("createDirectory invoked", { oldPath, newPath })

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    driver?.directories
      .move({ oldPath, newPath })
      .then((raw) => {
        const oldParent = OrdoDirectory.findParent(oldPath, draft.root)
        const newParent = OrdoDirectory.findParent(raw.path, draft.root)

        if (!oldParent) throw new Error("Could not find parent of the directory to be moved")
        if (!newParent) throw new Error("Target parent does not exist")

        oldParent.children = oldParent.children.filter((child) => child.path === oldPath)
        newParent?.children.push(OrdoDirectory.from(raw))
      })
      .catch(logger.error)
  })

  drive$.next(nextDrive)
}
