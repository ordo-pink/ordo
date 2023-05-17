import { Colours, CommandHandler, OrdoDirectoryDTO } from "@ordo-pink/common-types"
import { wieldCommands, wieldTranslate } from "@ordo-pink/react-utils"
import { showCommandPalette, hideCommandPalette } from "@ordo-pink/stream-command-palette"

export const setDirectoryColor: CommandHandler<OrdoDirectoryDTO> = ({ payload }) => {
  const { t } = wieldTranslate("fs")
  const { emit } = wieldCommands()

  showCommandPalette(
    Colours.map((colour) => ({
      id: colour,
      name: t(`colour-${colour}`),
      onSelect: () => {
        emit("fs.update-directory", {
          ...payload,
          metadata: { ...payload.metadata, colour },
        })

        hideCommandPalette()
      },
      Icon: () => <div className={`rounded-full p-2 ${`bg-${colour}`}`} />,
    })),
  )
}
