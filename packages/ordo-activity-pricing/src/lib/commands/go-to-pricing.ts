import { createOrdoCommand } from "@ordo-pink/extensions"

export const GoToPricingCommand = createOrdoCommand<"ordo-activity-pricing">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-pricing/go-to-pricing",
  accelerator: "alt+p",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/pricing"),
})
