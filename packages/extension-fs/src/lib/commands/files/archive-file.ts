import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"

export const archiveFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const commands = useCommands()

  commands.emit("fs.move-file", {
    oldPath: payload.path,
    newPath: `/.trash/${payload.readableName}${payload.extension}`,
  })
}
