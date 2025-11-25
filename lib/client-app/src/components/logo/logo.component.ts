/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka } from "@ordo-pink/oss-maoka"

import "./logo.styles.css"

export const ordo_logo = maoka.create("a", ({ use }) => {
	const handle_click = ordo.fns
		.pipe(ordo_client.fns.prevent_default)
		.pipe(ordo_client.fns.stop_propagation)
		.pipe(() => get_pathname())
		.pipe(p => p !== "/" && void hunter.shoot("ordo_main.router.set_pathname", "/"))

	const { hunter } = use(ordo_client_maoka.context.consume)
	const get_pathname = use(ordo_client_maoka.jabs.router_pathname$)
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_id("logo"))
	use(ordo_client_maoka.jabs.set_attribute("href", "/"))
	use(ordo_client_maoka.jabs.set_attribute("tabindex", "1"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))

	return () => {
		const pathname = get_pathname()
		const has_bright_class = use(ordo_client_maoka.jabs.has_class("bright"))

		if (pathname === "/") use(ordo_client_maoka.jabs.add_class("bright"))
		else if (has_bright_class) use(ordo_client_maoka.jabs.remove_class("bright"))

		return translate("logo")
	}
})
