import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const unarchiveDirectory: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const commands = wieldCommands()

  commands.emit("fs.move-directory", {
    oldPath: payload.path,
    newPath: `/${payload.readableName}/`,
  })
}
