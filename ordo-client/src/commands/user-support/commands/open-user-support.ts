import { showSupportModal } from "$commands/user-support/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const OpenUserSupport = createOrdoCommand({
  title: "@ordo-command-user-support/open-user-support",
  action: ({ dispatch }) => {
    dispatch(showSupportModal())
  },
  showInCommandPalette: true,
  Icon: () => import("$commands/user-support/components/support-icon"),
})
