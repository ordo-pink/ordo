import { CommandHandler, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const listDirectory: CommandHandler<OrdoDirectoryPath> = ({ logger, payload }) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("listDirectory invoked", payload)

  driver?.directories.get(payload).then((dir) => {
    const nextDrive = produce(drive, (draft) => {
      if (!draft) return

      if (dir.path === "/") {
        draft.root = OrdoDirectory.from(dir)

        return
      }

      const parentPath = OrdoDirectory.getParentPath(dir.path)
      const parent = draft.root.findDirectoryDeep(parentPath)

      if (!parent) throw new Error("Could not find parent of the requested directory")

      const child = parent?.findDirectory(dir.path)

      if (child) {
        parent.children.splice(parent.children.indexOf(child))
      }

      parent.children.push(OrdoDirectory.from(dir))
    })

    drive$.next(nextDrive)
  })
}
