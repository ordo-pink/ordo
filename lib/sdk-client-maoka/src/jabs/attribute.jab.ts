/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const set_attribute: OrdoClientMaoka.Jabs.SetAttribute =
	(k, v = "") =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => n.value.setAttribute(k, v)))

export const set_id: OrdoClientMaoka.Jabs.SetId =
	id =>
	({ use, node }) =>
		use(set_attribute("id", id ?? String(node.id)))

declare global {
	namespace OrdoClientMaoka.Jabs {
		type SetAttribute = (key: string, value?: string) => Maoka.Jab
		type SetId = (id?: string) => Maoka.Jab
	}
}
