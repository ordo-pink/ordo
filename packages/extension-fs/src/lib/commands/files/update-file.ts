import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const updateFile: CommandHandler<IOrdoFile> = ({ logger, payload }) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!driver || !drive) return

  const draft = createDraft(drive)

  const ordoFile = OrdoDirectory.findFileDeep(payload.path, draft.root)

  if (!ordoFile) throw new Error("Could not find file that needs an update")

  const metadata = ordoFile.metadata
  ordoFile.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.files
    .set(payload)
    .then(() => {
      emit("fs.update-file.complete", payload)
    })
    .catch((error) => {
      logger.error(error)

      ordoFile.metadata = metadata
      const revertDrive = finishDraft(draft)
      drive$.next(revertDrive)

      emit("fs.update-file.error", error)
    })
}
