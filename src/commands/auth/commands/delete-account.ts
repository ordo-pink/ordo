import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const DeleteAccount = createOrdoCommand({
  title: "@ordo-command-auth/delete-account",
  action: ({ env, translate }) => {
    const translatedSubject = translate("@ordo-command-auth/delete-account-subject", {
      email: env.userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/delete-account-body", {
      username: env.userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ env }) => Boolean(env.isAuthenticated),
  Icon: () => import("$commands/auth/components/delete-account-icon"),
})
