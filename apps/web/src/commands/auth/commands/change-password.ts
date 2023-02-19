import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"

export const ChangePasswordCommand = createOrdoCommand({
  title: "@ordo-command-auth/change-password",
  action: ({ env, translate, userData }) => {
    const translatedSubject = translate("@ordo-command-auth/change-password-email-subject", {
      email: userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/change-password-email-body", {
      username: userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ isAuthenticated }) => isAuthenticated,
  Icon: () => import("../components/change-password-icon"),
})
