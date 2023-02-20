import { createOrdoCommand } from "@ordo-pink/extensions"

export const RegisterCommand = createOrdoCommand({
  title: "@ordo-command-auth/register",
  action: ({ createRegisterUrl }) => {
    window.open(createRegisterUrl(), "_self")
  },
  accelerator: "alt+r",
  showInCommandPalette: ({ isAuthenticated }) => !isAuthenticated,
  Icon: () => import("../components/register-icon"),
})
