import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const restoreTrashBin: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { emit } = wieldCommands()

  if (payload.path === "/.trash/") {
    emit("fs.create-directory", "/.trash/")
  }
}
