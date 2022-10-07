import React, { PropsWithChildren, MouseEvent } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import Either from "@core/utils/either"

import Null from "@client/null"

type Props = {
  isShown: boolean
  hideModal: (event: MouseEvent) => void
}

export default function Modal({ isShown, hideModal, children }: PropsWithChildren<Props>) {
  useHotkeys("escape", (event) => hideModal(event as unknown as MouseEvent))

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="fixed m-0 p-10 top-0 left-0 right-0 bottom-0 cursor-default z-50 bg-neutral-500 dark:bg-neutral-900 bg-opacity-50 dark:bg-opacity-80"
      onClick={hideModal}
      onContextMenu={hideModal}
    >
      {children}
    </div>
  ))
}
