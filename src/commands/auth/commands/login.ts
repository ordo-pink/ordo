import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const LoginCommand = createOrdoCommand({
  title: "@ordo-command-auth/login",
  action: ({ createLoginUrl }) => {
    window.open(createLoginUrl(), "_self")
  },
  accelerator: "alt+l",
  showInCommandPalette: ({ env }) => !env.isAuthenticated,
  Icon: () => import("$commands/auth/components/login-icon"),
})
