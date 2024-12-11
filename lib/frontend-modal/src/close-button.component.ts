/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsX } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const ModalCloseButton = (modal: Ordo.Modal.Instance | null) => {
	if (!modal || !modal.show_close_button) return

	return Maoka.create("button", ({ use }) => {
		const commands = use(MaokaOrdo.Jabs.Commands.get)

		use(MaokaJabs.set_class("modal_close-button"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			commands.emit("cmd.application.modal.hide")
		}

		return () => BsX() as TMaokaElement
	})
}
