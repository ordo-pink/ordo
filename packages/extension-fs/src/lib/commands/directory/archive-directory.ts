import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$ } from "@ordo-pink/stream-drives"

export const archiveDirectory = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.getValue()
  const commands = useCommands()

  if (!driver) return

  commands.emit("fs.move-directory", {
    oldPath: payload.path,
    newPath: `/.trash/${payload.readableName}/`,
  })
}
