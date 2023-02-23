import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const RegisterCommand = createOrdoCommand({
  title: "@ordo-command-auth/register",
  action: ({ createRegisterUrl }) => {
    window.open(createRegisterUrl(), "_self")
  },
  accelerator: "alt+r",
  showInCommandPalette: ({ isAuthenticated }) => !isAuthenticated,
  Icon: () => import("$commands/auth/components/register-icon"),
})
