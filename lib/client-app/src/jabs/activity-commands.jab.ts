import { type Colonoscope, colonoscope } from "@ordo-pink/oss-colonoscope"
import type { Aist } from "@ordo-pink/oss-aist"
import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const activity_commands =
	(activities$: Zags.Instance<OrdoClient.Activity.State>, aist$: Aist.Instance): Maoka.Jab =>
	({ use }) => {
		const handle_register_activity: OrdoClient.Command.GunFor<"activity.register"> = item => {
			activities$.update("activities.items", items => (items.some(i => i.id === item.id) ? items : items.concat(item)))

			const pathname = aist$.$.select("router.pathname")

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

		const handle_unregister_activity: OrdoClient.Command.GunFor<"activity.unregister"> = id =>
			activities$.update("activities.items", items => items.filter(i => i.id !== id))

		const handle_set_search: OrdoClient.Command.GunFor<"router.set_search"> = s =>
			ordo.validations.is_string(s) ? aist$.set_search(s) : aist$.set_search_params(s)

		const handle_set_href: OrdoClient.Command.GunFor<"router.set_href"> = href => void open(href, "_blank")?.focus()

		const handle_onmount = () =>
			aist$.$.cheat("router.pathname", pathname => {
				const items = activities$.select("activities.items")

				activities$.update("activities.current", () => {
					let params: Colonoscope.Results = null

					const item = items.find(item => {
						for (const route of item.routes) {
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

		use(ordo_client_maoka.jabs.handle_command("activity.register", handle_register_activity))
		use(ordo_client_maoka.jabs.handle_command("activity.unregister", handle_unregister_activity))

		use(ordo_client_maoka.jabs.handle_command("router.set_hash", aist$.set_hash))
		use(ordo_client_maoka.jabs.handle_command("router.set_href", handle_set_href))
		use(ordo_client_maoka.jabs.handle_command("router.set_pathname", aist$.set_pathname))
		use(ordo_client_maoka.jabs.handle_command("router.set_search", handle_set_search))
	}
