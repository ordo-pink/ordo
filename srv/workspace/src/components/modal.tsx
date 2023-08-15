import { useHotkeys } from "react-hotkeys-hook"
import { BsX } from "react-icons/bs"
import { Either } from "#lib/either/mod"
import { getModal } from "$streams/modal"
import { useSubscription } from "$hooks/use-subscription"
import { __Modal$ } from "$streams/modal"
import Null from "$components/null"

const modal = getModal()

type _P = { modal$: __Modal$ }
export default function Modal({ modal$ }: _P) {
	const modalState = useSubscription(modal$)

	const handleHide = () => {
		modalState?.onHide()
		modal.hide()
	}

	useHotkeys("Esc", handleHide, [modalState])

	return Either.fromNullable(modalState).fold(Null, ({ Component, showCloseButton }) => (
		<div
			className="modal absolute z-[500] top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-neutral-900/80  to-stone-900/80  h-screen w-screen flex items-center justify-center"
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
