/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

export const ModalWrapper = (modal: Ordo.Modal.Instance | null) =>
	Maoka.create("div", async ({ use, element: current_element }) => {
		use(MaokaJabs.set_class("modal"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			if (!modal) return
			event.stopPropagation()
		}

		if (!modal) return

		use(MaokaJabs.add_class("active"))
		await modal.render(current_element as unknown as HTMLDivElement)
	})
