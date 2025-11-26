/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"

export const title = maoka.create("div", ({ use }) => {
	const title_element = document.querySelector("title")
	const handle_set_title: OrdoClient.Command.GunFor<"ordo_main.title.set_title"> = title => {
		if (title_element) {
			const title_str = title || "404"

			title_element.innerHTML = `${title_str} | Ordo.pink`
		}
	}

	use(ordo_client_maoka.jabs.handle_command("ordo_main.title.set_title", handle_set_title))
})
