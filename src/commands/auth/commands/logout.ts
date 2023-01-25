import { showLogoutModal } from "$commands/auth/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const LogoutCommand = createOrdoCommand({
  title: "@ordo-command-auth/logout",
  action: ({ dispatch }) => {
    dispatch(showLogoutModal())
  },
  showInCommandPalette: ({ env }) => Boolean(env.isAuthenticated),
  Icon: () => import("$commands/auth/components/logout-icon"),
})
