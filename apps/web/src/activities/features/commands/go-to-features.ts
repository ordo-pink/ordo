import { createOrdoCommand } from "@ordo-pink/extensions"

export const GoToFeaturesCommand = createOrdoCommand<"ordo-activity-features">({
  Icon: () => import("../components/icon"),
  title: "@ordo-activity-features/go-to-features",
  accelerator: "alt+f",
  showInCommandPalette: true,
  showInContextMenu: false,
  action: ({ navigate }) => navigate("/features"),
})
