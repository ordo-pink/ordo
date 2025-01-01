/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { Modal } from "./modal.component"
import { ModalCloseButton } from "./close-button.component"
import { ordo_app_state } from "../../../app.state"

import "./modal.css"

export const OrdoModal = Maoka.create("div", ({ use, on_unmount }) => {
	const get_modal_state = use(ordo_app_state.select_jab$("sections.modal"))

	const commands = ordo_app_state.zags.select("commands")

	commands.on("cmd.application.modal.show", on_modal_show)
	commands.on("cmd.application.modal.hide", on_modal_hide)

	use(MaokaJabs.set_class("modal-overlay"))
	use(MaokaJabs.listen("onclick", event => handle_click(event)))

	const handle_click = (event: Event) => {
		const state = get_modal_state()
		if (!state) return

		event.stopPropagation()

		commands.emit("cmd.application.modal.hide")
	}

	const handle_close = (event: KeyboardEvent) => {
		if (event.key !== "Escape") return
		handle_click(event)
	}

	document.addEventListener("keydown", handle_close)

	on_unmount(() => document.removeEventListener("keydown", handle_close))

	return () => {
		if (get_modal_state()) {
			use(MaokaJabs.add_class("active"))
			return [Modal, ModalCloseButton]
		}

		use(MaokaJabs.remove_class("active"))
	}
})

// --- Internal ---

// Define command handlers
const on_modal_show: Ordo.Command.HandlerOf<"cmd.application.modal.show"> = payload => {
	const on_unmount = payload.on_unmount ?? (() => void 0)
	const render = payload.render

	ordo_app_state.zags.update("sections.modal", () => ({ render, on_unmount }))
}

const on_modal_hide: Ordo.Command.HandlerOf<"cmd.application.modal.hide"> = () => {
	const state = ordo_app_state.zags.select("sections.modal")

	if (state && state.on_unmount) {
		state.on_unmount()
		ordo_app_state.zags.update("sections.modal", () => void 0)
	}
}
