/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_file_earmark, bs_folder_open } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"

import "./file-icon.styles.css"

/**
 * @context
 * @query data
 */
export const file_icon = maoka.create<{ item: Ordo.Data.Instance }>("div", ({ item, use }) => {
	const id = ordo.data.get_id(item)

	use(ordo_client_maoka.jabs.set_class("data-icon"))
	const get_children = use(ordo_client_maoka.jabs.data.get_children$(id))

	return () => {
		const children = get_children()

		// TODO Show as folder only if it is an ordo file with children
		if (children.some(ordo.data.has_parent(id))) return bs_folder_open()
		// TODO File association icon
		else return bs_file_earmark()
	}
})
