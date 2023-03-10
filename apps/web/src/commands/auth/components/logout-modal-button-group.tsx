import { lazyBox } from "@ordo-pink/fns"
import { useKeycloak } from "@ordo-pink/keycloak"
import { OrdoButtonSecondary, OrdoButtonPrimary } from "@ordo-pink/react"
import { useTranslation } from "react-i18next"
import { hideLogoutModal } from "../../../commands/auth/store"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"

export default function LogoutModalButtonGroup() {
  const dispatch = useAppDispatch()

  const { keycloak } = useKeycloak()

  const handleCancelButtonClick = lazyBox((box) => box.fold(() => dispatch(hideLogoutModal())))

  const handleOkButtonClick = lazyBox((box) =>
    box.fold(() => keycloak.logout({ redirectUri: "/home" })),
  )

  const { t } = useTranslation()

  const translatedCancel = t("@ordo-command-auth/button-cancel")
  const translatedOk = t("@ordo-command-auth/button-ok")

  return (
    <div className="auth_logout-modal_button-group">
      <OrdoButtonSecondary
        hotkey="escape"
        onClick={handleCancelButtonClick}
      >
        {translatedCancel}
      </OrdoButtonSecondary>

      <OrdoButtonPrimary
        hotkey="enter"
        onClick={handleOkButtonClick}
      >
        {translatedOk}
      </OrdoButtonPrimary>
    </div>
  )
}
