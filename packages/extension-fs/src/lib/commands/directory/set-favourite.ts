import { CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"

export const setFavourite = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const driver = fsDriver$.getValue()
  const drive = drive$.getValue()
  const { emit } = useCommands()

  if (!driver || !drive || payload.metadata.isFavourite === true) return

  emit("fs.update-directory", {
    ...payload,
    metadata: {
      ...payload.metadata,
      isFavourite: true,
    },
  })
}
