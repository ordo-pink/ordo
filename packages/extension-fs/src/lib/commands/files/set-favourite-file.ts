import { CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldCommands } from "@ordo-pink/react-utils"

export const setFavouriteFile: CommandHandler<IOrdoFile> = ({ payload }) => {
  const { emit } = wieldCommands()

  if (payload.metadata.isFavourite === true) return

  emit("fs.update-file", {
    ...payload,
    metadata: {
      ...payload.metadata,
      isFavourite: true,
    },
  })
}
