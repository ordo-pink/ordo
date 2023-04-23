import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const updateFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!driver || !drive) return

  const draft = createDraft(drive)

  const ordoFile = OrdoDirectory.findFileDeep(payload.path, draft.root)

  if (!ordoFile) throw new Error("Could not find file that needs an update")

  const metadata = ordoFile.metadata
  ordoFile.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  setDrive(newDrive)

  driver.files
    .set(payload)
    .then(() => {
      emit("fs.update-file.complete", payload)
    })
    .catch((error) => {
      ordoFile.metadata = metadata
      const revertDrive = finishDraft(draft)
      setDrive(revertDrive)

      emit("fs.update-file.error", error)
    })
}
