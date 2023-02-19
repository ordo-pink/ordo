import { Either } from "@ordo-pink/either"
import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import LogoutModalButtonGroup from "../../../commands/auth/components/logout-modal-button-group"
import { hideLogoutModal } from "../../../commands/auth/store"
import { AuthExtensionStore } from "../../../commands/auth/types"
import { useModal } from "../../../containers/app/hooks/use-modal"
import Null from "../../../core/components/null"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { preventDefault, stopPropagation } from "../../../core/utils/event"
import { lazyBox } from "../../../core/utils/lazy-box"

import "../index.css"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const authSelector = useExtensionSelector<AuthExtensionStore>()

  const isShown = authSelector((state) => state["ordo-command-auth"].isShown)

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const handleHide = lazyBox((box) => box.map(() => "").fold(() => dispatch(hideLogoutModal())))

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const { t } = useTranslation()
  const translatedQuestion = t("@ordo-command-auth/confirm-logout")

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={handleHide}>
      <div className="auth_logout-overlay">
        <div
          onClick={handleModalClick}
          className="auth_logout-modal"
          role="none"
        >
          <div className="auth_logout-modal_title">
            <div>{translatedQuestion}</div>
          </div>

          <LogoutModalButtonGroup />
        </div>
      </div>
    </Modal>
  ))
}
