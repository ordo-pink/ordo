import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import SupportBadge from "$core/components/badge/support"
import { OrdoButtonSecondary } from "$core/components/buttons"
import Fieldset from "$core/components/fieldset"
import { useActionContext } from "$core/hooks/use-action-context"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

export default function LogoutField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const logoutCommand = commands.find((command) => command.title === "@ordo-command-auth/logout")

  const { t } = useTranslation()

  const translatedChangePassword = t("@ordo-activity-user/logout")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => logoutCommand?.action(actionContext)),
  )

  return (
    <Fieldset className="relative">
      <div className="text-lg">{translatedChangePassword}</div>
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
