import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"

export const GoHomeCommand = createOrdoCommand<"ordo-activity-home">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-home/go-home",
  accelerator: "alt+h",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/home"),
})
