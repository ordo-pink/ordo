import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const updateDirectory = ({ logger, payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("updateDirectory invoked", payload)

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    const directory = OrdoDirectory.findDirectoryDeep(payload.path, draft.root)

    if (!directory) throw new Error("Could not find directory that needs an update")

    directory.metadata = payload.metadata
  })

  drive$.next(nextDrive)

  driver?.directories.set(payload).catch(logger.error)
}
