import { CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const setFavourite: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { emit } = wieldCommands()

  if (payload.metadata.isFavourite === true) return

  emit("fs.update-directory", {
    ...payload,
    metadata: {
      ...payload.metadata,
      isFavourite: true,
    },
  })
}
