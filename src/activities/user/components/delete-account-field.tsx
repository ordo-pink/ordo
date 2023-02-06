import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { AiOutlineUserDelete } from "react-icons/ai"

import { OrdoButtonSecondary } from "$core/components/buttons"
import Fieldset from "$core/components/fieldset"
import { useActionContext } from "$core/hooks/use-action-context"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

export default function DeleteAccountField() {
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const deleteAccountCommand = commands.find(
    (command) => command.title === "@ordo-command-auth/delete-account",
  )

  const { t } = useTranslation()

  const translatedDeleteAccount = t("@ordo-activity-user/delete-account")

  const handleButtonClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => deleteAccountCommand?.action(actionContext)),
  )

  return (
    <Fieldset>
      <div className="flex flex-row-reverse w-full">
        <OrdoButtonSecondary
          onClick={handleButtonClick}
          center
        >
          <div className="flex items-center space-x-2">
            <AiOutlineUserDelete />
            <div>{translatedDeleteAccount}</div>
          </div>
        </OrdoButtonSecondary>
      </div>
    </Fieldset>
  )
}
