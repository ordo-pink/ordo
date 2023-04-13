import { Colours, CommandContext, IOrdoDirectory } from "@ordo-pink/common-types"
import { useCommands } from "@ordo-pink/react-utils"
import { showCommandPalette, hideCommandPalette } from "@ordo-pink/stream-command-palette"
import i18next from "i18next"

export const setDirectoryColor = ({ payload }: CommandContext<IOrdoDirectory>) => {
  const { t } = i18next
  const { emit } = useCommands()

  showCommandPalette(
    Colours.map((color) => ({
      id: color,
      name: t(`color-${color}`, { ns: "fs" }),
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
