/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Colonoscope, colonoscope } from "@ordo-pink/oss-colonoscope"
import type { Aist } from "@ordo-pink/oss-aist"
import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const activity_commands =
	(activities$: Zags.Instance<OrdoClient.Activity.State>, router: Aist.Instance): Maoka.Jab =>
	({ use }) => {
		const handle_add_activity: OrdoClient.Command.GunFor<"@ordo/main.activity.add"> = item => {
			activities$.update("activities.items", items => (items.some(i => i.id === item.id) ? items : items.concat(item)))

			const pathname = router.$.select("router.pathname")

			for (const route of item.routes) {
				if (colonoscope.is_doctor(route)) {
					const params = colonoscope.check(route, pathname)

					if (params) {
						activities$.update("activities.current", () => ({ ...item, params }))
						break
					}
				} else if (route === pathname) {
					activities$.update("activities.current", () => ({ ...item, params: null }))
					break
				}
			}
		}

		const handle_delete_activity: OrdoClient.Command.GunFor<"@ordo/main.activity.delete"> = id =>
			activities$.update("activities.items", items => items.filter(i => i.id !== id))

		const handle_set_search: OrdoClient.Command.GunFor<"@ordo/main.router.set_search"> = s =>
			ordo.validations.is_string(s) ? router.set_search(s) : router.set_search_params(s)

		const handle_set_href: OrdoClient.Command.GunFor<"@ordo/main.router.set_href"> = href => void open(href, "_blank")?.focus()

		const handle_onmount = () =>
			router.$.cheat("router.pathname", pathname => {
				const items = activities$.select("activities.items")

				activities$.update("activities.current", () => {
					let params: Colonoscope.Results = null

					const item = items.find(item => {
						for (const route of item.routes) {
							if (!pathname) return false

							if (colonoscope.is_doctor(route)) {
								const results = colonoscope.check(route, pathname)

								if (results) {
									params = results
									return true
								}
							}
							if (route === pathname) {
								return true
							}
						}

						return false
					})

					return item && { ...item, params }
				})
			})

		use(maoka_dom.jabs.onmount(handle_onmount))

		use(ordo_client_maoka.jabs.handle_command("@ordo/main.activity.add", handle_add_activity))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.activity.delete", handle_delete_activity))

		use(ordo_client_maoka.jabs.handle_command("@ordo/main.router.set_hash", router.set_hash))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.router.set_href", handle_set_href))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.router.set_pathname", router.set_pathname))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.router.set_search", handle_set_search))
	}
