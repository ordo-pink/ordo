import { createOrdoCommand } from "@ordo-pink/extensions"
import { showOpenFile } from "../store"

export default createOrdoCommand<"ordo-command-open-file">({
  Icon: () => import("../components/open-file-icon"),
  title: "@ordo-command-open-file/show-open-file",
  accelerator: "ctrl+p",
  showInCommandPalette: false,
  showInContextMenu: false,
  action: ({ dispatch }) => void dispatch(showOpenFile()),
})
