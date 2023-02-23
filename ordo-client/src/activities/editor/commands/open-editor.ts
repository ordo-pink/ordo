import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export default createOrdoCommand<"ordo-activity-editor">({
  Icon: () => import("$activities/editor/components/icon"),
  title: "@ordo-activity-editor/open-editor",
  accelerator: "ctrl+shift+e",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/editor"),
})
