import { ThunkFn } from "@ordo-pink/common-types"
import { PropsWithChildren, useCallback, useState } from "react"
import Modal from "./components/modal"

type Props = {
  onShow?: ThunkFn<void>
  onHide?: ThunkFn<void>
}

export const useModal = () => {
  const [isShown, setIsShown] = useState(false)

  const showModal = () => setIsShown(true)
  const hideModal = () => setIsShown(false)

  const Component = useCallback(
    ({ children, onShow, onHide }: PropsWithChildren<Props>) => (
      <Modal
        isShown={isShown}
        hideModal={hideModal}
        onShow={onShow}
        onHide={onHide}
      >
        {children}
      </Modal>
    ),
    [isShown],
  )

  return {
    showModal,
    hideModal,
    Modal: Component,
  }
}
