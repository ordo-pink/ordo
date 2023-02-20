import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import SupportBadge from "../../../core/components/badge/support"
import { OrdoButtonSecondary } from "../../../core/components/buttons"
import Fieldset from "../../../core/components/fieldset"
import { useActionContext } from "../../../core/hooks/use-action-context"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default function PasswordField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const changePasswordCommand = commands.find(
    (command) => command.title === "@ordo-command-auth/change-password",
  )

  const { t } = useTranslation()

  const translatedPassword = t("@ordo-activity-user/password")
  const translatedChangePassword = t("@ordo-activity-user/change-password")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => changePasswordCommand?.action(actionContext)),
  )

  return (
    <Fieldset className="relative">
      <div className="text-lg">{translatedPassword}</div>
      <OrdoButtonSecondary
        onClick={handleButtonClick}
        hotkey="shift+p"
        center
      >
        {translatedChangePassword}
      </OrdoButtonSecondary>

      <SupportBadge className="absolute bottom-0 right-0 md:top-0 md:bottom-auto" />
    </Fieldset>
  )
}
