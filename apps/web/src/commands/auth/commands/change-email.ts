import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"

export const ChangeEmailCommand = createOrdoCommand({
  title: "@ordo-command-auth/change-email",
  action: ({ userData, translate, env }) => {
    const translatedSubject = translate("@ordo-command-auth/change-email-subject", {
      email: userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/change-email-body", {
      username: userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ isAuthenticated }) => isAuthenticated,
  Icon: () => import("../components/change-email-icon"),
})
