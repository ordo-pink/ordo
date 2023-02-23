import { showOpenFile } from "$commands/open-file/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export default createOrdoCommand<"ordo-command-open-file">({
  Icon: () => import("$commands/open-file/components/open-file-icon"),
  title: "@ordo-command-open-file/show-open-file",
  accelerator: "ctrl+p",
  showInCommandPalette: false,
  showInContextMenu: false,
  action: ({ dispatch }) => void dispatch(showOpenFile()),
})
