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

import { type Maoka, create } from "@ordo-pink/oss-maoka"
import { type Zags, create } from "@ordo-pink/oss-zags"
import type { Aist } from "@ordo-pink/oss-aist"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { colonoscope } from "@ordo-pink/oss-colonoscope"

export const init_activities_jab: (
	hunter: ClientSDK.Hunter,
	aist$: Aist.Stream,
) => Maoka.Jab<Zags.Instance<ClientSDK.Activity.State>> =
	(hunter, aist$) =>
	({ use }) => {
		const handle_onmount = () => {
			const release_register = hunter.track("activity.register", item => {
				activities$.update("items", items => (items.some(i => i.id === item.id) ? items : items.concat(item)))

				const pathname = aist$.select("pathname")

				for (const route of item.routes) {
					if ((colonoscope.is_doctor(route) && colonoscope.check(route, pathname)) || route === pathname) {
						activities$.update("current", () => item)
						break
					}
				}
			})

			const divorce_rotor = aist$.cheat("pathname", pathname => {
				const items = activities$.select("items")

				activities$.update(
					"current",
					() =>
						items.find(item => {
							for (const route of item.routes) {
								if (colonoscope.is_doctor(route)) {
									if (colonoscope.check(route, pathname)) return true
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

		use(create.dom.jabs.onmount(handle_onmount))

		return activities$
	}

const activities$ = create<ClientSDK.Activity.State>({ current: null, items: [] })
