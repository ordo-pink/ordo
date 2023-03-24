import { Either } from "@ordo-pink/either"
import { Null, useModal, useSubscription } from "@ordo-pink/react-utils"
import { modal$ } from "@ordo-pink/stream-modals"
import { useHotkeys } from "react-hotkeys-hook"
import { BsX } from "react-icons/bs"

export default function Modal() {
  const Component = useSubscription(modal$)

  const Render = () => Component as unknown as JSX.Element

  const { hideModal } = useModal()

  useHotkeys("Esc", hideModal)

  return Either.fromNullable(Component).fold(Null, (Comp) => (
    <div
      className="absolute z-[500] top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-neutral-900/80  to-stone-900/80  h-screen w-screen flex items-center justify-center"
      onClick={hideModal}
    >
      <div
        className="relative bg-white dark:bg-neutral-700 rounded-lg shadow-lg px-16 py-8"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          className="absolute right-1 top-1 text-neutral-500 p-2 cursor-pointer"
          onClick={hideModal}
        >
          <BsX />
        </div>
        <Render />
      </div>
    </div>
  ))
}
