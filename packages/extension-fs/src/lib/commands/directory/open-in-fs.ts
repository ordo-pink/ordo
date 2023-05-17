import { CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const openDirectoryInFs: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { emit } = wieldCommands()

  emit("router.navigate", `/fs${payload.path}`)
}
