import { maoka } from "@ordo-pink/oss-maoka"

import "./logo.styles.css"

export const ordo_logo = maoka.create("a", ({ use }) => {
	const handle_click = ordo.fns
		.pipe(ordo_client.fns.prevent_default)
		.pipe(ordo_client.fns.stop_propagation)
		.pipe(() => void hunter.shoot("router.set_pathname", "/"))

	const { hunter } = use(ordo_client_maoka.context.consume)
	const get_pathname = use(ordo_client_maoka.jabs.router_pathname$)
	const t_logo = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_attribute("href", "/"))
	use(ordo_client_maoka.jabs.set_class("logo"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))

	return () => {
		const pathname = get_pathname()

		if (pathname === "/") use(ordo_client_maoka.jabs.add_class("bright"))
		else use(ordo_client_maoka.jabs.remove_class("bright"))

		return t_logo("logo")
	}
})
