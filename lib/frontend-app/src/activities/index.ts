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
