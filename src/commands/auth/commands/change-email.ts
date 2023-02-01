import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const ChangeEmailCommand = createOrdoCommand({
  title: "@ordo-command-auth/change-email",
  action: ({ env, translate }) => {
    const translatedSubject = translate("@ordo-command-auth/change-email-subject", {
      email: env.userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/change-email-body", {
      username: env.userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ env }) => Boolean(env.isAuthenticated),
  Icon: () => import("$commands/auth/components/change-email-icon"),
})
