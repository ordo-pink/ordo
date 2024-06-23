// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { ComponentType, MouseEvent, useEffect } from "react"
import { BehaviorSubject } from "rxjs"
import { BsX } from "react-icons/bs"

import { Either } from "@ordo-pink/either"

import { useAccelerator, useCommands, useSubscription } from "@ordo-pink/frontend-react-hooks"

import Null from "@ordo-pink/frontend-react-components/null"

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
	const commands = useCommands()

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
			className="fixed inset-0 z-[500] flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-tr  from-neutral-900/80  to-stone-900/80 p-4"
			onClick={handleHide}
		>
			<div
				className="relative w-full max-w-3xl rounded-lg bg-neutral-100 shadow-lg dark:bg-neutral-700"
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
const showModal: Client.Commands.Handler<Client.Modal.HandleShowPayload> = payload => {
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
		<div className="absolute right-1 top-1 cursor-pointer p-2 text-neutral-500" onClick={onClick}>
			<BsX />
		</div>
	))
