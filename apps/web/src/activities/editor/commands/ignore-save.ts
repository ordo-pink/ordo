import { createOrdoCommand } from "@ordo-pink/extensions"

export const IgnoreSave = createOrdoCommand<"ordo-activity-editor">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-editor/ignore-save",
  accelerator: "ctrl+s",
  showInCommandPalette: false,
  showInContextMenu: false,
  action: () => void 0,
})
