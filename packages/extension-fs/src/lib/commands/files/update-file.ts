import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import produce from "immer"

export const updateFile: CommandHandler<IOrdoFile> = ({ logger, payload }) => {
  const driver = fsDriver$.value
  const drive = drive$.value

  logger.debug("updateFile invoked", payload)

  const nextDrive = produce(drive, (draft) => {
    if (!draft) return

    const ordoFile = OrdoDirectory.findFileDeep(payload.path, draft.root)

    if (!ordoFile) throw new Error("Could not find file that needs an update")

    ordoFile.metadata = payload.metadata
  })

  drive$.next(nextDrive)

  driver?.files.set(payload).catch(logger.error)
}
