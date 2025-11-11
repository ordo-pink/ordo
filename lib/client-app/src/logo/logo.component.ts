import { maoka } from "@ordo-pink/oss-maoka"

import "./logo.styles.css"

export const ordo_logo = maoka.create("a", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	use(ordo_client_maoka.jabs.set_attribute("href", "/"))

	const t_logo = use(ordo_client_maoka.jabs.translate$)
	const get_pathname = use(ordo_client_maoka.jabs.router_pathname$)

	use(ordo_client_maoka.jabs.set_class("logo"))
	use(ordo_client_maoka.jabs.listen("onclick", e => handle_click(e)))

	const prevent_default = (e: Event) => {
		e.preventDefault()
		return e
	}

	const handle_click = ordo.fns.pipe(prevent_default).pipe(() => hunter.shoot("router.set_pathname", "/"))

	return () => {
		const pathname = get_pathname()

		if (pathname === "/") use(ordo_client_maoka.jabs.add_class("bright"))
		else use(ordo_client_maoka.jabs.remove_class("bright"))

		return t_logo("logo")
	}
})
