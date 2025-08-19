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

import { type Aist, aist } from "@ordo-pink/oss-aist"
import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { core } from "@ordo-pink/sdk-core"

export const create_rotor_jab: (hunter: ClientSDK.Hunter) => Maoka.Jab<Aist.Stream> =
	hunter =>
	({ use }) => {
		const rotor = aist.create(window)

		const open = window.open
		window.open = undefined as any

		const handle_onmount = () => {
			const release_set_hash = hunter.track("router.set_hash", rotor.set_hash)
			const release_set_href = hunter.track("router.set_href", href => void open(href, "_blank")?.focus())
			const release_set_pathname = hunter.track("router.set_pathname", rotor.set_pathname)
			const release_set_search = hunter.track("router.set_search", params =>
				core.fns.is_string(params) ? rotor.set_search(params) : rotor.set_search_params(params),
			)

			return () => {
				release_set_hash()
				release_set_href()
				release_set_pathname()
				release_set_search()

				rotor.destroy()
			}
		}

		use(maoka.dom.jabs.onmount(handle_onmount))

		return rotor.$
	}
