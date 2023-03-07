import { createOrdoCommand } from "@ordo-pink/extensions"

export const OpenCalendarCommand = createOrdoCommand<"ordo-activity-calendar">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-calendar/open-calendar",
  accelerator: "ctrl+shift+k",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/calendar"),
})
