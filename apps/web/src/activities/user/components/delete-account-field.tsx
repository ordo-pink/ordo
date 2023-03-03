import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Fieldset, OrdoButtonSecondary } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { AiOutlineUserDelete } from "react-icons/ai"
import { useActionContext } from "../../../core/hooks/use-action-context"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

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
      <div className="md:flex md:flex-row-reverse md:w-full">
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
