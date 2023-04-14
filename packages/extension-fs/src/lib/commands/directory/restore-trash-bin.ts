import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"

export const restoreTrashBin = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const { emit } = useCommands()

  if (payload.path === "/.trash/") {
    emit("fs.create-directory", "/.trash/")
  }
}
