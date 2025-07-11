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

import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { type Zags, create_zags } from "@ordo-pink/zags"
import { colonoscope, is_colonoscopy_doctor } from "@ordo-pink/colonoscope"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import type { RoutaryBrowser } from "@ordo-pink/routary-browser"

export const init_activities_jab: (
	hunter: ClientSDK.Hunter,
	rotor$: RoutaryBrowser.Zags,
) => Maoka.Jab<Zags.Instance<ClientSDK.Activity.State>> =
	(hunter, rotor$) =>
	({ use }) => {
		const handle_onmount = () => {
			const release_register = hunter.track("activity.register", item => {
				activities$.update("items", items => (items.some(i => i.id === item.id) ? items : items.concat(item)))

				const pathname = rotor$.select("pathname")

				for (const route of item.routes) {
					if ((is_colonoscopy_doctor(route) && colonoscope(route, pathname)) || route === pathname) {
						activities$.update("current", () => item)
						break
					}
				}
			})

			const divorce_rotor = rotor$.cheat("pathname", pathname => {
				const items = activities$.select("items")

				activities$.update(
					"current",
					() =>
						items.find(item => {
							for (const route of item.routes) {
								if (is_colonoscopy_doctor(route)) {
									if (colonoscope(route, pathname)) return true
								}
								if (route === pathname) return true
							}

							return false
						}) ?? null,
				)
			})

			return () => {
				release_register()
				divorce_rotor()
			}
		}

		use(maoka_dom.jabs.onmount(handle_onmount))

		return activities$
	}

const activities$ = create_zags<ClientSDK.Activity.State>({ current: null, items: [] })
