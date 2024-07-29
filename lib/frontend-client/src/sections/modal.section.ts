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

import { BehaviorSubject, pairwise } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { Switch } from "@ordo-pink/switch"
import { type TLogger } from "@ordo-pink/logger"
import { noop } from "@ordo-pink/tau"

type P = { commands: Client.Commands.Commands; logger: TLogger }
export const init_modal = ({ commands, logger }: P) => {
	logger.debug("🟡 Initialising modal...")

	commands.on<cmd.modal.show>("modal.show", on_modal_show)
	commands.on<cmd.modal.hide>("modal.hide", on_modal_hide)

	const modal_overlay_element = document.querySelector("#modal-overlay") as HTMLDivElement
	const modal_element = document.querySelector("#modal") as HTMLDivElement

	const unmount = (on_unmount = noop) => {
		on_unmount()

		modal_element.innerHTML = ""
		modal_element.onclick = noop
		modal_overlay_element.classList.replace("flex", "hidden")
		modal_overlay_element.onclick = noop
	}

	modal$.pipe(pairwise()).subscribe(([prev_state_option, state_option]) => {
		Switch.Match(state_option)
			.case(
				state => state.is_none,
				() => {
					const prev_state = prev_state_option.unwrap()

					if (prev_state) unmount(prev_state.on_unmount)
				},
			)
			.default(() => {
				const state = state_option.unwrap()!

				modal_overlay_element.onclick = () => commands.emit<cmd.modal.hide>("modal.hide")
				modal_element.onclick = event => event.stopPropagation()

				state.render(modal_element)

				if (state.show_close_button) {
					const close_button = document.createElement("div")

					close_button.classList.add(
						"absolute",
						"right-0",
						"top-0",
						"cursor-pointer",
						"p-2",
						"text-neutral-500",
						"hover:text-pink-500",
						"transition-colors",
						"duration-300",
					)
					close_button.onclick = () => commands.emit<cmd.modal.hide>("modal.hide")
					close_button.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
					<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
					</svg>`

					modal_element.appendChild(close_button)
				}

				modal_overlay_element.classList.replace("hidden", "flex")
			})
	})

	logger.debug("🟢 Initialised modal.")
}

/**
 * Shows modals all over the place. Modals appear on setting ModalState and hide when the state is
 * set to `null`.
 *
 * @commands
 * - `cmd.modal.show`
 * - `cmd.modal.hide`
 */
// export default function Modal() {
// 	const modalState = useSubscription(modal$)
// 	const commands = useCommands()

// 	const handleHide = () => {
// 		if (!modalState) return

// 		modalState.onHide()
// 		commands.emit<cmd.modal.hide>("modal.hide")
// 	}

// 	useAccelerator("Esc", handleHide, [modalState])

// 	useEffect(() => {
// 		commands.on<cmd.modal.hide>("modal.hide", on_modal_hide)
// 		commands.on<cmd.modal.show>("modal.show", on_modal_show)

// 		return () => {
// 			commands.on<cmd.modal.hide>("modal.hide", on_modal_hide)
// 			commands.on<cmd.modal.show>("modal.show", on_modal_show)
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [])

// 	return Either.fromNullable(modalState).fold(Null, ({ Component, showCloseButton }) => (
// 		<div
// 			className="fixed inset-0 z-[500] flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-tr  from-neutral-900/80  to-stone-900/80 p-4"
// 			onClick={handleHide}
// 		>
// 			<div
// 				className="relative w-full max-w-3xl rounded-lg bg-neutral-100 shadow-lg dark:bg-neutral-700"
// 				onClick={stopPropagation}
// 			>
// 				<CloseButton shouldShow={showCloseButton} onClick={handleHide} />
// 				<Component />
// 			</div>
// 		</div>
// 	))
// }

// --- Internal ---

/**
 * ModalState definition
 * TODO: Move to core
 */
type ModalState = {
	show_close_button?: boolean
	on_unmount?: () => void
	render: (div: HTMLDivElement) => void
}

// Define helper functions
// const stopPropagation = (event: MouseEvent) => event.stopPropagation()

// Define Observable to maintain modal state
const modal$ = new BehaviorSubject<TOption<ModalState>>(O.None())

// Define command handlers
const on_modal_show: Client.Commands.Handler<Client.Modal.ModalPayload> = payload => {
	const show_close_button = payload.show_close_button ?? true
	const on_unmount = payload.on_unmount ?? (() => void 0)
	const render = payload.render

	modal$.next(O.Some({ render, show_close_button, on_unmount }))
}

const on_modal_hide = () => modal$.next(O.None())

/**
 * Close button component.
 */
// type CloseButtonP = { shouldShow: boolean; onClick: () => void }
// const CloseButton = ({ shouldShow, onClick }: CloseButtonP) =>
// 	Either.fromBoolean(() => shouldShow).fold(Null, () => (
// 		<div className="absolute right-1 top-1 cursor-pointer p-2 text-neutral-500" onClick={onClick}>
// 			<BsX />
// 		</div>
// 	))
