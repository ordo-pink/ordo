/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TOption } from "@ordo-pink/option"

import { ModalCloseButton } from "./src/close-button.component"
import { ModalWrapper } from "./src/modal.component"

import "./modal.css"

export const Modal = ($: Observable<TOption<Ordo.Modal.Instance>>, ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let modal_state: Ordo.Modal.Instance | null = null

		type TModalState = TOption<Ordo.Modal.Instance>

		const commands = use(MaokaOrdo.Jabs.Commands.get)

		use(MaokaJabs.set_class("modal-overlay"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: Event) => {
			if (!modal_state) return

			event.stopPropagation()
			commands.emit("cmd.application.modal.hide")
		}

		const handle_modal_update = (state: TModalState) => {
			modal_state = state.unwrap() ?? null
			void refresh()
		}

		const handle_close = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return
			handle_click(event)
		}

		use(MaokaOrdo.Jabs.subscribe($, state => handle_modal_update(state)))
		document.addEventListener("keydown", handle_close)

		on_unmount(() => document.removeEventListener("keydown", handle_close))

		return () => {
			if (modal_state) use(MaokaJabs.add_class("active"))
			else use(MaokaJabs.remove_class("active"))

			return [ModalWrapper(modal_state), ModalCloseButton(modal_state)]
		}
	})
