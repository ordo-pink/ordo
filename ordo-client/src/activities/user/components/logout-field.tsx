import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { AiOutlineLogout } from "react-icons/ai"

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

  const translatedLogout = t("@ordo-activity-user/logout")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => logoutCommand?.action(actionContext)),
  )

  return (
    <Fieldset>
      <div className="md:flex md:flex-row-reverse md:w-full">
        <OrdoButtonSecondary
          onClick={handleButtonClick}
          center
        >
          <div className="flex items-center space-x-2">
            <AiOutlineLogout />
            <div>{translatedLogout}</div>
          </div>
        </OrdoButtonSecondary>
      </div>
    </Fieldset>
  )
}
