import { CommandContext, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { createDraft, finishDraft } from "immer"

export const createDirectory = ({ logger, payload: path }: CommandContext<OrdoDirectoryPath>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!drive || !driver) return

  driver?.directories
    .create(path)
    .then((raw) => {
      const draft = createDraft(drive)

      const parent = OrdoDirectory.findParent(raw.path, draft.root)

      if (!parent) throw new Error("Cannot find parent of the created directory")

      const directory = OrdoDirectory.from(raw)

      parent.children.push(directory)

      OrdoDirectory.sort(parent.children)

      const newDrive = finishDraft(draft)

      drive$.next(newDrive)

      emit("fs.create-directory.complete", directory)
    })
    .catch((error) => {
      logger.error(error)

      emit("fs.create-directory.error", error)
    })
}
