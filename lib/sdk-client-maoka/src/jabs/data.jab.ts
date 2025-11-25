/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

export const get_children$: (parent: Ordo.Data.Parent | Ordo.Data.Instance) => Maoka.Jab<() => Ordo.Data.Instance[]> =
	p =>
	({ use }) => {
		const { query } = use(ordo_client_maoka.context.consume)
		const parent = ordo.data.parent_guard(p) ? p : ordo.data.get_parent(p)

		return use(ordo_client_maoka.jabs.cheat$(query, "data.root", ordo.data.get_children(parent)))
	}

export const get_by_id$: (id: Ordo.Data.Id | null) => Maoka.Jab<() => Ordo.Data.Instance | null> =
	id =>
	({ use }) => {
		if (!id) return () => null

		const { query } = use(ordo_client_maoka.context.consume)

		return use(ordo_client_maoka.jabs.cheat$(query, `data.root.${id}`, i => i ?? null))
	}

export const get_ancestors$: (id: Ordo.Data.Id | null) => Maoka.Jab<() => Ordo.Data.Instance[]> =
	id =>
	({ use }) => {
		const { query } = use(ordo_client_maoka.context.consume)

		return id ? use(ordo_client_maoka.jabs.cheat$(query, "data.root", ordo.data.get_ancestors(id))) : () => []
	}
