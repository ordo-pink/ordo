import type { Thunk } from "@core/types"

import React, { useState, useCallback, MouseEvent, PropsWithChildren } from "react"

import Modal from "@client/common/hooks/use-modal/components/modal"

type Props = {
  onHide?: Thunk<void>
  onShow?: Thunk<void>
}

export const useModalWindow = () => {
  const [isShown, setIsShown] = useState(false)

  const showModal = (event?: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

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
    ({ children, onShow, onHide }: PropsWithChildren<Props>) => (
      <Modal isShown={isShown} hideModal={hideModal} onShow={onShow} onHide={onHide}>
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
