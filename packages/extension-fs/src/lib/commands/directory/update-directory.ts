import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const updateDirectory: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!drive || !driver) return

  const draft = createDraft(drive)

  const directory = OrdoDirectory.findDirectoryDeep(payload.path, draft.root)

  if (!directory) {
    return emit(
      "fs.update-directory.error",
      new Error("Could not find directory that needs an update"),
    )
  }

  const metadata = directory.metadata

  directory.metadata = payload.metadata

  const newDrive = finishDraft(draft)

  setDrive(newDrive)

  driver.directories
    .set(payload)
    .then(() => {
      emit("fs.update-directory.complete", payload)
    })
    .catch((error) => {
      directory.metadata = metadata
      const revertDrive = finishDraft(draft)
      setDrive(revertDrive)

      emit("fs.update-directory.error", error)
    })
}
