import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const openAccountCommand = createOrdoCommand<"ordo-activity-settings">({
  Icon: () => import("$activities/settings/components/icon"),
  title: "@ordo-activity-settings/change-theme",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: () => {
    return
  },
})
