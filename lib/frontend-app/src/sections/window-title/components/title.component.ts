/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { type ClientMaoka, client_maoka } from "@ordo-pink/sdk-client-maoka"
import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { result } from "@ordo-pink/oss-result"

/**
 * Title div watches for "title.set_title" shots and makes changes to the DOM. This behavior is extracted into
 * a separate Maoka component to avoid redundant rerenders of higher level DOM nodes in case the `t$` jab triggers
 * a refresh due to changes in translations.
 */
export const title = maoka.create("div", ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)
	const translate = use(client_maoka.jabs.t$) // TODO Move to context

	use(maoka_dom.jabs.onmount(listen_set_title_shots(hunter, translate, document)))
})

// --- Internal ---

type ListenSetTitleShots = (hunter: ClientSDK.Hunter, translate: ClientMaoka.Jabs.TFn, document: Document) => () => void
const listen_set_title_shots: ListenSetTitleShots = (hunter, translate, document) => () =>
	result
		.from_nullable(document.querySelector("title"))
		.pipe(result.ops.map(el => hunter.track("title.set_title", gun_for_set_title(el, translate))))
		.cata(result.catas.if_ok(release => release))

type GunForSetTitle = (element: HTMLTitleElement, translate: ClientMaoka.Jabs.TFn) => ClientSDK.GunFor<"title.set_title">
const gun_for_set_title: GunForSetTitle = (el, translate) => t =>
	result
		.of(translate(t, "404"))
		.pipe(result.ops.map(t => `${t} | Ordo.pink`))
		.cata(result.catas.if_ok(title => void (el.innerText = title)))
