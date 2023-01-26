import { useTranslation } from "react-i18next"

import { hideSupportModal } from "../store"
import { OrdoButtonSecondary, OrdoButtonNeutral } from "$core/components/buttons"
import { useEnv } from "$core/hooks/use-env"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { lazyBox } from "$core/utils/lazy-box"

export default function DeleteModalButtonGroup() {
  const dispatch = useAppDispatch()
  const env = useEnv()

  const handleCancelButtonClick = lazyBox((box) => box.fold(() => dispatch(hideSupportModal())))

  const handleEmailButtonClick = lazyBox((box) =>
    box.fold(() => {
      env.openExternal("mailto:support@ordo.pink")
    }),
  )

  const handleTelegramButtonClick = lazyBox((box) =>
    box.fold(() => {
      env.openExternal("https://t.me/ordo_pink")
    }),
  )

  const { t } = useTranslation()

  const translatedEmail = t("@ordo-command-user-support/button-email")
  const translatedTelegram = t("@ordo-command-user-support/button-telegram")
  const translatedCancel = t("@ordo-command-user-support/button-cancel")

  return (
    <div className="user-support-modal_button-group">
      <OrdoButtonSecondary
        hotkey="escape"
        onClick={handleCancelButtonClick}
      >
        {translatedCancel}
      </OrdoButtonSecondary>

      <OrdoButtonNeutral
        hotkey="e"
        onClick={handleEmailButtonClick}
      >
        {translatedEmail}
      </OrdoButtonNeutral>

      <OrdoButtonNeutral
        hotkey="t"
        onClick={handleTelegramButtonClick}
      >
        {translatedTelegram}
      </OrdoButtonNeutral>
    </div>
  )
}
