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

import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"

import { modal$ } from "../modal.state"

export const overlay = maoka.create("div", ({ kindergarten, use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	const handle_show = () => use(maoka_sdk.jabs.classes.add("active"))
	const handle_hide = () => use(maoka_sdk.jabs.classes.remove("active"))
	const handle_click = () => hunter.shoot("modal.hide")
	const handle_mount = () => modal$.cheat("instance", instance => (instance ? handle_show() : handle_hide()))

	use(maoka_sdk.jabs.classes.set("modal_wrapper"))
	use(maoka_sdk.jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))

	return kindergarten
})
