import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const openAccountCommand = createOrdoCommand<"ordo-activity-user">({
  Icon: () => import("$activities/user/components/icon"),
  title: "@ordo-activity-user/open-account",
  accelerator: "ctrl+shift+u",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/user"),
})
