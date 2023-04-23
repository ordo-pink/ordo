import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const archiveDirectory = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const commands = wieldCommands()

  commands.emit("fs.move-directory", {
    oldPath: payload.path,
    newPath: `/.trash/${payload.readableName}/`,
  })
}
