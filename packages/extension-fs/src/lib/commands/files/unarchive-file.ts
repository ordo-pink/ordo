import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const unarchiveFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const commands = wieldCommands()

  commands.emit("fs.move-file", {
    oldPath: payload.path,
    newPath: `/${payload.readableName}${payload.extension}`,
  })
}
