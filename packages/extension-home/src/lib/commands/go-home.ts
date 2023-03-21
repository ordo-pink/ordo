import { createOrdoCommand } from "@ordo-pink/extensions"

export const GoHomeCommand = createOrdoCommand<"ordo-activity-home">({
  Icon: () => import("../components/home-icon"),
  title: "@ordo-activity-home/go-home",
  accelerator: "alt+h",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/home"),
})
