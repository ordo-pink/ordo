import { CommandHandler, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { wieldCommands, wieldFsDriver } from "@ordo-pink/react-utils"

export const duplicateFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const driver = wieldFsDriver()
  const { emit } = wieldCommands()

  if (!driver) return

  const newReadableName = `${payload.readableName} copy`
  const newPath = payload.path.replace(payload.readableName, newReadableName) as OrdoFilePath

  const newFile = OrdoFile.from({
    ...payload,
    path: newPath,
  })

  driver.files
    .getContent(payload.path)
    .then((res) => res.text())
    .then((content) => {
      emit("fs.create-file", { file: newFile, content })
    })
}
