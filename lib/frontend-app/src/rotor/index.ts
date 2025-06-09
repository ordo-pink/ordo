import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { type RoutaryBrowser, create_routary_browser } from "@ordo-pink/routary-browser"
import { type Client } from "@ordo-pink/sdk-client"
import { core } from "@ordo-pink/sdk-core"

export const create_rotor_jab: (hunter: Client.Hunter) => Maoka.Jab<RoutaryBrowser.Zags> =
	hunter =>
	({ use }) => {
		const rotor = create_routary_browser(window)

		// TODO External routes

		const handle_onmount = () => {
			const release_set_hash = hunter.track("router.set_hash", rotor.set_hash)
			const release_set_pathname = hunter.track("router.set_pathname", rotor.set_pathname)
			const release_set_search = hunter.track("router.set_search", params =>
				core.validations.is_string(params) ? rotor.set_search(params) : rotor.set_search_params(params),
			)

			return () => {
				release_set_hash()
				release_set_pathname()
				release_set_search()

				rotor.destroy()
			}
		}

		use(maoka_dom.jabs.onmount(handle_onmount))

		return rotor.$
	}
