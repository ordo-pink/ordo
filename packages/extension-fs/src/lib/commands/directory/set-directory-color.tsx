import { Colours, CommandHandler, IOrdoDirectory } from "@ordo-pink/common-types"
import { wieldCommands, wieldTranslate } from "@ordo-pink/react-utils"
import { showCommandPalette, hideCommandPalette } from "@ordo-pink/stream-command-palette"

export const setDirectoryColor: CommandHandler<IOrdoDirectory> = ({ payload }) => {
  const { t } = wieldTranslate("fs")
  const { emit } = wieldCommands()

  showCommandPalette(
    Colours.map((color) => ({
      id: color,
      name: t(`color-${color}`),
      onSelect: () => {
        emit("fs.update-directory", {
          ...payload,
          metadata: { ...payload.metadata, color },
        })

        hideCommandPalette()
      },
      Icon: () => <div className={`rounded-full p-2 ${`bg-${color}`}`} />,
    })),
  )
}
