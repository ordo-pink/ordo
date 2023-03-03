import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Fieldset, OrdoButtonPrimary } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { BsPatchCheckFill, BsPatchExclamationFill } from "react-icons/bs"
import { useActionContext } from "../../../core/hooks/use-action-context"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default function EmailVerifiedField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const verifyEmailCommand = commands.find((c) => c.title === "@ordo-command-auth/verify-email")

  const { t } = useTranslation()

  const translatedEmailVerified = t("@ordo-activity-user/email-verified")
  const translatedEmailNotVerified = t("@ordo-activity-user/email-not-verified")
  const translatedVerifyEmail = t("@ordo-activity-user/resend-verification")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => verifyEmailCommand?.action(actionContext)),
  )

  return Either.fromBoolean(actionContext.userData?.emailVerified).fold(
    () => (
      <Fieldset>
        <div className="text-lg text-rose-600 dark:text-rose-400 flex space-x-2 items-center">
          <BsPatchExclamationFill />
          <div>{translatedEmailNotVerified}</div>
        </div>
        <OrdoButtonPrimary
          onClick={handleButtonClick}
          hotkey="shift+v"
          center
        >
          {translatedVerifyEmail}
        </OrdoButtonPrimary>
      </Fieldset>
    ),
    () => (
      <Fieldset>
        <div className="text-green-600 dark:text-green-400 flex space-x-2 items-center">
          <BsPatchCheckFill />
          <div>{translatedEmailVerified}</div>
        </div>
      </Fieldset>
    ),
  )
}
