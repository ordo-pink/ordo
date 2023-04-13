import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const updateDirectory = ({ logger, payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const directory = OrdoDirectory.findDirectoryDeep(payload.path, draft.root)

  if (!directory) throw new Error("Could not find directory that needs an update")

  const metadata = directory.metadata

  directory.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  drive$.next(newDrive)

  driver?.directories
    .set(payload)
    .then(() => {
      emit("fs.update-directory.complete", payload)
    })
    .catch((error) => {
      logger.error(error)

      directory.metadata = metadata
      const revertDrive = finishDraft(draft)
      drive$.next(revertDrive)

      emit("fs.update-directory.error", error)
    })
}
