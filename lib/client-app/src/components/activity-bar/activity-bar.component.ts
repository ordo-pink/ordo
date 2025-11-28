/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./activity-bar.styles.css"

export type Args = { command_palette_toggle: () => Maoka.Component; sidebar_toggle: () => Maoka.Component }
export const activity_bar = maoka.create<Args>("div", ({ command_palette_toggle, sidebar_toggle, use }) => {
	const { query } = use(ordo_client_maoka.context.consume)
	const get_state = use(ordo_client_maoka.jabs.cheat$(query, "activities"))

	use(ordo_client_maoka.jabs.set_id("activity-bar"))
	use(ordo_client_maoka.jabs.set_class("activity-bar"))

	return () => {
		const { current, items } = get_state()

		return [
			command_palette_toggle(),

			activity_bar_activities(() =>
				items
					.filter(item => !!item.render_icon)
					.map(item => activity_bar_link({ is_current: !!current && current.id === item.id, item })),
			),

			sidebar_toggle(),
		]
	}
})

// --- Internal ---

type ActivityBarLinkArgs = { item: OrdoClient.Activity.Instance; is_current: boolean }
const activity_bar_link = maoka.create<ActivityBarLinkArgs>("a", ({ is_current, item, use }) => {
	const url = item.start_route ?? item.routes[0]
	const { render_icon, readable_name } = item

	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)

	const handle_click = ordo.fns
		.pipe(ordo_client.fns.prevent_default)
		.pipe(() => hunter.shoot("@ordo/main.router.set_pathname", url))

	use(ordo_client_maoka.jabs.set_attribute("href", url))
	use(ordo_client_maoka.jabs.set_attribute("tabindex", "2"))
	use(ordo_client_maoka.jabs.set_class("link"))
	use(ordo_client_maoka.jabs.listen("click", handle_click))

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("title", translate(readable_name)))

		return activity_bar_icon({ is_current, render_icon, readable_name })
	}
})

type ActivityBarIconArgs = Pick<OrdoClient.Activity.Instance, "render_icon" | "readable_name"> & { is_current: boolean }
const activity_bar_icon = maoka.create<ActivityBarIconArgs>("span", ({ use, is_current, render_icon, readable_name }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("icon"))
	use(maoka_dom.jabs.if_dom(n => void render_icon!(n.value)))

	return () => {
		const t_readable_name = translate(readable_name)

		use(ordo_client_maoka.jabs.set_attribute("title", t_readable_name))

		if (is_current) use(ordo_client_maoka.jabs.add_class("active"))
		else use(ordo_client_maoka.jabs.remove_class("active"))
	}
})

const activity_bar_activities = maoka_styled.div("activities")
