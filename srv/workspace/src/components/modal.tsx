import { Either } from "#lib/either/mod"
import { useHotkeys } from "react-hotkeys-hook"
import { BsX } from "react-icons/bs"
import { useModal } from "../streamsmodal"
import { useSubscription } from "../streamssubscription"
import { modal$ } from "../streams/modal"
import Null from "./null"

/**
 * The modal window wrapper.
 *
 * You can use the modal window with the `useModal` hook.
 */
export default function Modal() {
	const modal = useSubscription(modal$)
	const { hideModal } = useModal()

	const handleHide = () => {
		modal?.onHide()
		hideModal()
	}

	useHotkeys("Esc", handleHide, [modal])

	return Either.fromNullable(modal).fold(Null, ({ Component, showCloseButton }) => (
		<div
			className="absolute z-[500] top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-neutral-900/80  to-stone-900/80  h-screen w-screen flex items-center justify-center"
			onClick={handleHide}
		>
			<div
				className="relative bg-neutral-100 dark:bg-neutral-700 rounded-lg shadow-lg"
				onClick={e => {
					e.stopPropagation()
				}}
			>
				{showCloseButton ? (
					<div
						className="absolute right-1 top-1 text-neutral-500 p-2 cursor-pointer"
						onClick={handleHide}
					>
						<BsX />
					</div>
				) : null}
				<Component />
			</div>
		</div>
	))
}
