import { createOrdoCommand } from "@ordo-pink/extensions"
import { showLogoutModal } from "../../../commands/auth/store"

export const LogoutCommand = createOrdoCommand({
  title: "@ordo-command-auth/logout",
  action: ({ dispatch }) => {
    dispatch(showLogoutModal())
  },
  showInCommandPalette: ({ isAuthenticated }) => isAuthenticated,
  Icon: () => import("../components/logout-icon"),
})
