import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const removeDirectory = ({ logger, payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("removeDirectory invoked", payload)

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    const parent = OrdoDirectory.findParent(payload.path, draft.root)

    if (!parent) throw new Error("Could not find parent of the directory being removed")

    parent.children = parent.children.filter((child) => child.path !== payload.path)
  })

  drive$.next(nextDrive)

  driver?.directories.remove(payload.path).catch(logger.error)
}
