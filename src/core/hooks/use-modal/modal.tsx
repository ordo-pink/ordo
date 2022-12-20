import { KeyboardEvent, PropsWithChildren, useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import Null from "$core/components/null"
import { ThunkFn } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

import "$core/hooks/use-modal/index.css"

type Props = {
  isShown: boolean
  hideModal: ThunkFn<void>
  onShow?: ThunkFn<void>
  onHide?: ThunkFn<void>
}

export default function Modal({
  isShown,
  hideModal,
  children,
  onShow = noOp,
  onHide = noOp,
}: PropsWithChildren<Props>) {
  useHotkeys("escape", (event) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .map(hideModal),
  )

  useEffect(() => {
    isShown ? onShow() : onHide()
  }, [isShown])

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") hideModal()
  }

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="modal-overlay"
      onClick={hideModal}
      onContextMenu={hideModal}
      onKeyDown={handleEscapeKeyDown}
      role="none"
    >
      {children}
    </div>
  ))
}
