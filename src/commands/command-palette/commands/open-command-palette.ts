import { showCommandPalette } from "$commands/command-palette/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export default createOrdoCommand<"ordo-command-command-palette">({
  Icon: () => import("$commands/command-palette/components/command-palette-icon"),
  title: "@ordo-command-command-palette/show-command-palette",
  accelerator: "ctrl+shift+p",
  showInCommandPalette: false,
  showInContextMenu: false,
  action: ({ dispatch }) => void dispatch(showCommandPalette()),
})
