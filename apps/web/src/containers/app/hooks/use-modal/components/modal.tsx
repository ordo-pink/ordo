import { ThunkFn } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { noOp, lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Null } from "@ordo-pink/react-utils"
import { PropsWithChildren, useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"

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
  const hide = lazyBox<{ preventDefault: ThunkFn<void>; stopPropagation: ThunkFn<void> }>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => hideModal()),
  )

  useHotkeys("escape", hide)

  useEffect(() => {
    isShown ? onShow() : onHide()
  }, [isShown, onShow, onHide])

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="fixed m-0 p-10 top-0 left-0 right-0 bottom-0 cursor-default z-50 bg-neutral-500 dark:bg-neutral-900 bg-opacity-50 dark:bg-opacity-80"
      onClick={hide}
      onContextMenu={hide}
      role="none"
    >
      {children}
    </div>
  ))
}
