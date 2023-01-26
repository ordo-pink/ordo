import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const ChangePasswordCommand = createOrdoCommand({
  title: "@ordo-command-auth/change-password",
  action: ({ env }) => {
    env.openExternal(`mailto:support@ordo.pink?subject=Change password&body=Email: `)
  },
  showInCommandPalette: ({ env }) => Boolean(env.isAuthenticated),
  Icon: () => import("$commands/auth/components/change-password-icon"),
})
