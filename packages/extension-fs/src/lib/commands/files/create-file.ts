import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldDrive, wieldFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"

export const createFile: CommandHandler<{ file: IOrdoFile; content?: string }> = ({
  payload: { file, content = "" },
}) => {
  const driver = wieldFsDriver()
  const [drive, setDrive] = wieldDrive()
  const { emit } = wieldCommands()

  if (!drive || !driver) return

  driver.files
    .create({ file, content })
    .then((raw) => {
      const draft = createDraft(drive)

      const parent = OrdoDirectory.isOrdoDirectory(raw)
        ? OrdoDirectory.findParent(raw.path, draft.root)
        : OrdoFile.findParent(raw.path, draft.root)

      if (!parent) throw new Error("Cannot find parent of the created file")

      const result = OrdoDirectory.isOrdoDirectory(raw) ? OrdoDirectory.of(raw) : OrdoFile.of(raw)

      parent.children.push(result)

      if (!parent.metadata.childOrder) {
        parent.metadata.childOrder = parent.children.map((child) => child.readableName)
      } else {
        parent.metadata.childOrder.push(result.readableName)
      }

      emit("fs.update-directory", OrdoDirectory.from(parent))

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      setDrive(newDrive)

      emit("fs.create-file.complete", result)
    })
    .catch((error) => {
      emit("fs.create-file.error", error)
    })
}
