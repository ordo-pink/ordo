import { createOrdoCommand } from "@ordo-pink/extensions"

export const OpenEditorCommand = createOrdoCommand<"ordo-activity-editor">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-editor/open-editor",
  accelerator: "ctrl+shift+e",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/editor"),
})
