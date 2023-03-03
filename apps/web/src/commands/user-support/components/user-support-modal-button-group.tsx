import { lazyBox } from "@ordo-pink/fns"
import { OrdoButtonSecondary, OrdoButtonNeutral } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { AiTwotoneMail } from "react-icons/ai"
import { BsTelegram } from "react-icons/bs"
import { useEnv } from "../../../core/hooks/use-env"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { hideSupportModal } from "../store"

export default function DeleteModalButtonGroup() {
  const dispatch = useAppDispatch()
  const env = useEnv()

  const handleCancelButtonClick = lazyBox((box) => box.fold(() => dispatch(hideSupportModal())))

  const handleEmailButtonClick = lazyBox((box) =>
    box.map(() => env.openExternal("mailto:support@ordo.pink")).fold(handleCancelButtonClick),
  )

  const handleTelegramButtonClick = lazyBox((box) =>
    box.map(() => env.openExternal("https://t.me/ordo_pink")).fold(handleCancelButtonClick),
  )

  const { t } = useTranslation()

  const translatedEmail = t("@ordo-command-user-support/button-email")
  const translatedTelegram = t("@ordo-command-user-support/button-telegram")
  const translatedCancel = t("@ordo-command-user-support/button-cancel")

  return (
    <div className="user-support-modal_button-group">
      <OrdoButtonSecondary
        hotkey="escape"
        center
        onClick={handleCancelButtonClick}
      >
        {translatedCancel}
      </OrdoButtonSecondary>

      <OrdoButtonNeutral
        hotkey="e"
        onClick={handleEmailButtonClick}
      >
        <div className="flex space-x-2 items-center">
          <AiTwotoneMail className="text-neutral-700 dark:text-neutral-300 shrink-0" />
          <div>{translatedEmail}</div>
        </div>
      </OrdoButtonNeutral>

      <OrdoButtonNeutral
        hotkey="t"
        onClick={handleTelegramButtonClick}
      >
        <div className="flex space-x-2 items-center">
          <BsTelegram className="text-neutral-700 dark:text-neutral-300 shrink-0" />
          <div>{translatedTelegram}</div>
        </div>
      </OrdoButtonNeutral>
    </div>
  )
}
