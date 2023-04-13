import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const createFile: CommandHandler<{ file: IOrdoFile; content?: string }> = ({
  logger,
  payload: { file, content = "" },
}) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  driver.files
    .create({ file, content })
    .then((raw) => {
      const draft = createDraft(drive)

      const parent = OrdoDirectory.isOrdoDirectoryRaw(raw)
        ? OrdoDirectory.findParent(raw.path, draft.root)
        : OrdoFile.findParent(raw.path, draft.root)

      if (!parent) throw new Error("Cannot find parent of the created file")

      const result = OrdoDirectory.isOrdoDirectoryRaw(raw)
        ? OrdoDirectory.from(raw)
        : OrdoFile.from(raw)

      parent.children.push(result)

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      drive$.next(newDrive)

      emit("fs.create-file.complete", result)
    })
    .catch((error) => {
      logger.error(error)

      emit("fs.create-file.error", error)
    })
}
