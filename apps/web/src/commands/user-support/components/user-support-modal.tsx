import { Either } from "@ordo-pink/either"
import { lazyBox, stopPropagation, preventDefault } from "@ordo-pink/fns"
import { Null } from "@ordo-pink/react-utils"
import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useModal } from "../../../containers/app/hooks/use-modal"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import UserSupportModalButtonGroup from "../components/user-support-modal-button-group"
import { hideSupportModal } from "../store"
import { SupportExtensionStore } from "../types"
import "../index.css"

export default function CreateModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const userSupportSelector = useExtensionSelector<SupportExtensionStore>()

  const isShown = userSupportSelector((state) => state["ordo-command-user-support"].isShown)

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const handleHide = lazyBox((box) => box.map(() => "").fold(() => dispatch(hideSupportModal())))

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const { t } = useTranslation()
  const translatedQuestion = t("@ordo-command-user-support/call-to-support")

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={handleHide}>
      <div className="user-support-overlay">
        <div
          onClick={handleModalClick}
          className="user-support-modal"
          role="none"
        >
          <div className="user-support-modal_title">
            <div>{translatedQuestion}</div>
          </div>

          <UserSupportModalButtonGroup />
        </div>
      </div>
    </Modal>
  ))
}
