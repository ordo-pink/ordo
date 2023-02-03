import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const GoToPricingCommand = createOrdoCommand<"ordo-activity-pricing">({
  Icon: () => import("$activities/pricing/components/icon"),
  title: "@ordo-activity-pricing/go-to-pricing",
  accelerator: "alt+p",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/pricing"),
})
