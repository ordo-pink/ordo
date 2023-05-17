import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const restoreTrashBin: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { emit } = wieldCommands()

  if (payload.path === "/.trash/") {
    emit("fs.create-directory", "/.trash/")
  }
}
