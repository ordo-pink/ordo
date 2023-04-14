import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const openDirectoryInFs: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { emit } = wieldCommands()

  emit("router.navigate", `/fs${payload.path}`)
}
