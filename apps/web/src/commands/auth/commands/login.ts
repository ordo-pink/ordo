import { createOrdoCommand } from "@ordo-pink/extensions"

export const LoginCommand = createOrdoCommand({
  title: "@ordo-command-auth/login",
  action: ({ createLoginUrl }) => {
    window.open(createLoginUrl(), "_self")
  },
  accelerator: "alt+l",
  showInCommandPalette: ({ isAuthenticated }) => !isAuthenticated,
  Icon: () => import("../components/login-icon"),
})
