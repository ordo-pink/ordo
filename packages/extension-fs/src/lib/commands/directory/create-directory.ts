import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"

export const createDirectory = ({ logger, payload: path }: CommandContext<OrdoDirectoryPath>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("createDirectory invoked", path)

  if (!drive || !driver) return

  driver?.directories
    .create(path)
    .then((raw) => {
      const parent = OrdoDirectory.findParent(raw.path, drive.root)

      if (!parent) throw new Error("Cannot find parent of the created file")

      parent.children.push(OrdoDirectory.from(raw))

      OrdoDirectory.sort(parent.children)

      drive$.next({
        ...drive,
        root: drive.root,
      })
    })
    .catch(logger.error)
}
