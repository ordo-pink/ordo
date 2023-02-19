import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"

export const DeleteAccount = createOrdoCommand({
  title: "@ordo-command-auth/delete-account",
  action: ({ env, userData, translate }) => {
    const translatedSubject = translate("@ordo-command-auth/delete-account-subject", {
      email: userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/delete-account-body", {
      username: userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ isAuthenticated }) => isAuthenticated,
  Icon: () => import("../components/delete-account-icon"),
})
