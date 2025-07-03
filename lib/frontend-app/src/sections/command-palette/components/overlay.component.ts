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

import { context, maoka_sdk } from "@ordo-pink/sdk-maoka"
import { maoka_dom, maoka_styled } from "@ordo-pink/maoka"

import { command_palette$ } from "../command-palette.state"

/**
 * Command palette overlay that blurs out the background content and handles clicks to close
 * the command palette.
 */
export const command_palette_overlay = maoka_styled.div("command-palette_wrapper", ({ use }) => {
	const { hunter } = use(context.consume)

	const handle_show = () => use(maoka_sdk.jabs.classes.add("active"))
	const handle_hide = () => use(maoka_sdk.jabs.classes.remove("active"))
	const handle_click = () => hunter.shoot("command_palette.hide")
	const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

	use(maoka_sdk.jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))
})
