import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const unsetFavouriteFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const { emit } = wieldCommands()

  if (payload.metadata.isFavourite === false) return

  emit("fs.update-file", {
    ...payload,
    metadata: {
      ...payload.metadata,
      isFavourite: false,
    },
  })
}
