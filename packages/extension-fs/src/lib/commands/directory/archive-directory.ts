import { CommandContext, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const archiveDirectory = ({ payload }: CommandContext<OrdoDirectoryDTO>) => {
  const commands = wieldCommands()

  commands.emit("fs.move-directory", {
    oldPath: payload.path,
    newPath: `/.trash/${payload.readableName}/`,
  })
}
