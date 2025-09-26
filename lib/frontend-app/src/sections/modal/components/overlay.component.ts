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

import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import { create_component } from "@ordo-pink/oss-maoka"

import { modal$ } from "../modal.state"

export const overlay = create_component.create("div", ({ kindergarten, use }) => {
	const { hunter } = use(client_maoka.context.consume)

	const handle_show = () => use(client_maoka.jabs.classes.add("active"))
	const handle_hide = () => use(client_maoka.jabs.classes.remove("active"))
	const handle_click = () => hunter.shoot("modal.hide")
	const handle_mount = () => modal$.cheat("instance", instance => (instance ? handle_show() : handle_hide()))

	use(client_maoka.jabs.classes.set("modal_wrapper"))
	use(client_maoka.jabs.listen("onclick", handle_click))
	use(create_component.dom.jabs.onmount(handle_mount))

	return kindergarten
})
