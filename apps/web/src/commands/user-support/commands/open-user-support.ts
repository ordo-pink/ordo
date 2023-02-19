import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"
import { showSupportModal } from "../store"

export const OpenUserSupport = createOrdoCommand({
  title: "@ordo-command-user-support/open-user-support",
  action: ({ dispatch }) => {
    dispatch(showSupportModal())
  },
  showInCommandPalette: true,
  Icon: () => import("../components/support-icon"),
})
