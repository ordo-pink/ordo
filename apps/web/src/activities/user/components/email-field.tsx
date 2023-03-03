import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Fieldset, OrdoButtonSecondary, SupportBadge } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { useActionContext } from "../../../core/hooks/use-action-context"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default function EmailField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const changeEmailCommand = commands.find(
    (command) => command.title === "@ordo-command-auth/change-email",
  )

  const { t } = useTranslation()

  const translatedEmail = t("@ordo-activity-user/email")
  const translatedChangeEmail = t("@ordo-activity-user/change-email")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => changeEmailCommand?.action(actionContext)),
  )

  return (
    <Fieldset className="relative">
      <div className="text-lg">{translatedEmail}</div>
      <div>{actionContext.userData?.email}</div>
      <div>
        <OrdoButtonSecondary
          onClick={handleButtonClick}
          hotkey="shift+e"
          center
        >
          {translatedChangeEmail}
        </OrdoButtonSecondary>
      </div>

      <SupportBadge className="absolute bottom-0 right-0 md:top-0 md:bottom-auto" />
    </Fieldset>
  )
}
