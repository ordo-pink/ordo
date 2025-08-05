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

import { Maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { context } from "@ordo-pink/sdk-maoka"

import { close_modal } from "./components/close-modal.component"
import { modal } from "./components/modal.component"
import { modal$ } from "./modal.state"
import { overlay } from "./components/overlay.component"

import "./modal.style.css"

export const create_modal_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	use(internal.track_prey_jab)

	return () => overlay(() => [modal(), close_modal()])
}

namespace internal {
	export const track_prey_jab: Maoka.Jab = ({ use }) => {
		const { hunter } = use(context.consume)

		const handle_mount = () => {
			const release_show = hunter.track("modal.show", params => modal$.update("instance", () => params))
			const release_hide = hunter.track("modal.hide", () => modal$.update("instance", () => void 0))

			return () => {
				release_hide()
				release_show()
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
}
