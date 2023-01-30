import { MouseEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"

import UserSupportModalButtonGroup from "$commands/user-support/components/user-support-modal-button-group"
import { hideSupportModal } from "$commands/user-support/store"

import { SupportExtensionStore } from "$commands/user-support/types"
import { useModal } from "$containers/app/hooks/use-modal"

import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

import "$commands/user-support/index.css"

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
