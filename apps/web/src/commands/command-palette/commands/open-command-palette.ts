import { createOrdoCommand } from "@ordo-pink/extensions"
import { showCommandPalette } from "../store"

export default createOrdoCommand<"ordo-command-command-palette">({
  Icon: () => import("../components/command-palette-icon"),
  title: "@ordo-command-command-palette/show-command-palette",
  accelerator: "ctrl+shift+p",
  showInCommandPalette: false,
  showInContextMenu: false,
  action: ({ dispatch }) => void dispatch(showCommandPalette()),
})
