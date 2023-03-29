import { hideCommandPalette } from "@ordo-pink/stream-command-palette"
import { createExtension } from "@ordo-pink/stream-extensions"
import { BsShare } from "react-icons/bs"

export default createExtension(
  "links",
  ({ registerActivity, registerTranslations, commands, registerCommandPaletteItem, translate }) => {
    registerActivity("file-graph", {
      routes: ["/file-graph"],
      Component: () => <div>Andry Geydry</div>,
      Icon: BsShare,
    })

    registerTranslations({
      ru: { hello: "world" },
    })

    commands.on("open-file-graph", () => commands.emit("router.navigate", "/file-graph"))

    registerCommandPaletteItem({
      id: "links.open-file-graph",
      name: translate("hello"),
      Icon: BsShare,
      onSelect: () => {
        commands.emit("links.open-file-graph")

        hideCommandPalette()
      },
    })
  },
)
