import React, { useState, useCallback, MouseEvent, PropsWithChildren } from "react"

import Modal from "@client/modal/components/modal"

export const useModalWindow = () => {
  const [isShown, setIsShown] = useState(false)

  const showModal = (event?: MouseEvent) => {
    if (event) event.stopPropagation()
    setIsShown(true)
  }

  const hideModal = (event?: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setIsShown(false)
  }

  const Component = useCallback(
    ({ children }: PropsWithChildren) => (
      <Modal isShown={isShown} hideModal={hideModal}>
        {children}
      </Modal>
    ),
    [isShown]
  )

  return {
    showModal,
    hideModal,
    Modal: Component,
  }
}
