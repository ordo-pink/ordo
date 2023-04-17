import { Colours, CommandHandler, IOrdoFile } from "@ordo-pink/common-types"
import { wieldCommands, wieldTranslate } from "@ordo-pink/react-utils"
import { showCommandPalette, hideCommandPalette } from "@ordo-pink/stream-command-palette"

export const setFileColor: CommandHandler<IOrdoFile> = ({ payload }) => {
  const { t } = wieldTranslate("fs")
  const { emit } = wieldCommands()

  showCommandPalette(
    Colours.map((colour) => ({
      id: colour,
      name: t(`colour-${colour}`),
      onSelect: () => {
        emit("fs.update-file", {
          ...payload,
          metadata: { ...payload.metadata, colour },
        })

        hideCommandPalette()
      },
      Icon: () => <div className={`rounded-full p-2 ${`bg-${colour}`}`} />,
    })),
  )
}
