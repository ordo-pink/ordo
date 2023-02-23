import { createOrdoCommand } from "@ordo-pink/extensions"

export const OpenAccountCommand = createOrdoCommand<"ordo-activity-user">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-user/open-account",
  accelerator: "ctrl+shift+u",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/user"),
})
