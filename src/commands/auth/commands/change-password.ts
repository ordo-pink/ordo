import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const ChangePasswordCommand = createOrdoCommand({
  title: "@ordo-command-auth/change-password",
  action: ({ env, translate }) => {
    const translatedSubject = translate("@ordo-command-auth/change-password-email-subject", {
      email: env.userData?.email,
    })

    const translatedBody = translate("@ordo-command-auth/change-password-email-body", {
      username: env.userData?.username,
    })

    env.openExternal(`mailto:support@ordo.pink?subject=${translatedSubject}&body=${translatedBody}`)
  },
  showInCommandPalette: ({ env }) => Boolean(env.isAuthenticated),
  Icon: () => import("$commands/auth/components/change-password-icon"),
})
