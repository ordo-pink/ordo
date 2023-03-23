import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const createDirectory = ({ logger, payload: path }: CommandContext<OrdoDirectoryPath>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("createDirectory invoked", path)

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    driver?.directories
      .create(path)
      .then((raw) => {
        const parent = OrdoDirectory.findParent(raw.path, draft.root)

        if (!parent) throw new Error("Could not find directory that needs an update")

        parent.children.push(OrdoDirectory.from(raw))
      })
      .catch(logger.error)
  })

  drive$.next(nextDrive)
}
