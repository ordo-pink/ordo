import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./activity-bar.styles.css"

export const activity_bar = maoka.create<{
	activities$: Zags.Instance<OrdoClient.Activity.State>
	command_palette_toggle: () => Maoka.Component
	sidebar_toggle: () => Maoka.Component
}>("div", ({ command_palette_toggle, sidebar_toggle, use }) => {
	const { query } = use(ordo_client_maoka.context.consume)

	const get_state = use(ordo_client_maoka.jabs.cheat$(query, "activities"))

	use(ordo_client_maoka.jabs.set_class("activity-bar"))

	return () => {
		const { current, items } = get_state()

		return [command_palette_toggle(), activity_bar_activities(() => items.map(render_activity(current))), sidebar_toggle()]
	}
})

const activity_bar_link = maoka.create<{ item: OrdoClient.Activity.Instance; is_current: boolean }>(
	"a",
	({ is_current, item, use }) => {
		const { hunter } = use(ordo_client_maoka.context.consume)

		const url = item.start_route ?? item.routes[0]
		const translate = use(ordo_client_maoka.jabs.translate$)

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			hunter.shoot("router.set_pathname", url)
		}

		use(ordo_client_maoka.jabs.set_class("activity-bar_link"))
		use(ordo_client_maoka.jabs.set_attribute("href", url))
		use(ordo_client_maoka.jabs.listen("onclick", handle_click))

		return () => {
			use(ordo_client_maoka.jabs.set_attribute("title", translate(item.readable_name)))

			return activity_bar_icon({ is_current, render_icon: item.render_icon!, readable_name: item.readable_name })
		}
	},
)

const render_activity = (current?: OrdoClient.Activity.Instance) => (item: OrdoClient.Activity.Instance) =>
	item.render_icon && activity_bar_link({ is_current: !!current && current.id === item.id, item })

const activity_bar_activities = maoka_styled.div("activity-bar_activities")

const activity_bar_icon = maoka.create<
	Required<Pick<OrdoClient.Activity.Instance, "render_icon" | "readable_name">> & { is_current: boolean }
>("span", ({ use, is_current, render_icon, readable_name }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("activity-bar_icon"))
	use(maoka_dom.jabs.if_dom(n => void render_icon(n.value)))

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("title", translate(readable_name)))

		if (is_current) use(ordo_client_maoka.jabs.add_class("active"))
		else use(ordo_client_maoka.jabs.remove_class("active"))
	}
})
