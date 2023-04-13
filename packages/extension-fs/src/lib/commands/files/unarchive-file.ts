import { CommandContext, IOrdoFile } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$ } from "@ordo-pink/stream-drives"

export const unarchiveFile = ({ payload }: CommandContext<IOrdoFile>) => {
  const driver = fsDriver$.getValue()
  const commands = useCommands()

  if (!driver) return

  commands.emit("fs.move-file", {
    oldPath: payload.path,
    newPath: `/${payload.readableName}${payload.extension}`,
  })
}
