/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"

export const set_attribute_jab =
	(key: string, value = ""): Maoka.Jab =>
	({ use }) => {
		use(maoka.dom.jabs.hit_if_dom(n => n.value.setAttribute(key, value)))
		// TODO if_string
	}

export const set_id_jab =
	(id?: string): Maoka.Jab =>
	({ use, node }) =>
		use(set_attribute_jab("id", id ?? String(node.id)))
