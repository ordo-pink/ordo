// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ComponentType, MouseEvent, useEffect } from "react"
import { BehaviorSubject } from "rxjs"
import { BsX } from "react-icons/bs"
import { Commands, Modal as TModal, useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"
import { useAccelerator } from "$hooks/use-accelerator.hook"
import { useSubscription } from "$hooks/use-subscription"
import Null from "$components/null"

/**
 * Shows modals all over the place. Modals appear on setting ModalState and hide when the state is
 * set to `null`.
 *
 * @commands
 * - `cmd.modal.show`
 * - `cmd.modal.hide`
 */
export default function Modal() {
	const modalState = useSubscription(modal$)
	const { commands } = useSharedContext()

	const handleHide = () => {
		if (!modalState) return

		modalState.onHide()
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	useAccelerator("Esc", handleHide, [modalState])

	useEffect(() => {
		commands.on<cmd.modal.hide>("modal.hide", hideModal)
		commands.on<cmd.modal.show>("modal.show", showModal)

		return () => {
			commands.on<cmd.modal.hide>("modal.hide", hideModal)
			commands.on<cmd.modal.show>("modal.show", showModal)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Either.fromNullable(modalState).fold(Null, ({ Component, showCloseButton }) => (
		<div
			className="modal fixed overflow-hidden z-[500] top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-neutral-900/80  to-stone-900/80  h-screen w-screen flex items-center justify-center"
			onClick={handleHide}
		>
			<div
				className="relative rounded-lg shadow-lg bg-neutral-100 dark:bg-neutral-700"
				onClick={stopPropagation}
			>
				<CloseButton shouldShow={showCloseButton} onClick={handleHide} />
				<Component />
			</div>
		</div>
	))
}

// --- Internal ---

/**
 * ModalState definition
 */
type ModalState = {
	Component: ComponentType
	showCloseButton: boolean
	onHide: () => void
}

// Define helper functions
const stopPropagation = (event: MouseEvent) => event.stopPropagation()

// Define Observable to maintain modal state
const modal$ = new BehaviorSubject<ModalState | null>(null)

// Define command handlers
const showModal: Commands.Handler<TModal.HandleShowPayload> = ({ payload }) => {
	const showCloseButton = payload.options?.showCloseButton ?? true
	const onHide = payload.options?.onHide ?? (() => void 0)
	const Component = payload.Component

	modal$.next({ Component, showCloseButton, onHide })
}

const hideModal = () => modal$.next(null)

/**
 * Close button component.
 */
type CloseButtonP = { shouldShow: boolean; onClick: () => void }
const CloseButton = ({ shouldShow, onClick }: CloseButtonP) =>
	Either.fromBoolean(() => shouldShow).fold(Null, () => (
		<div className="absolute top-1 right-1 p-2 cursor-pointer text-neutral-500" onClick={onClick}>
			<BsX />
		</div>
	))
