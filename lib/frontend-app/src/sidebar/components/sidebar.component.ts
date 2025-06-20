import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { sidebar$ } from "../sidebar.state"

// TODO Automatically close sidebar in mobile if something was clicked
export const sidebar = maoka.create("aside", ({ use, node }) => {
	const { activities$, hunter } = use(maoka_sdk.context.consume)
	const get_sidebar = use(maoka_sdk.jabs.zags.marry$(sidebar$))
	const get_current_activity = use(maoka_sdk.jabs.zags.cheat$(activities$, "current"))
	const is_mobile = use(maoka_sdk.jabs.is_mobile)

	const handle_click = () => is_mobile && hunter.shoot("sidebar.hide")

	use(maoka_sdk.jabs.listen("onclick", handle_click))

	return () => {
		const { visible, enabled } = get_sidebar()

		const current_activity = get_current_activity()

		if (current_activity && current_activity.render_sidebar) hunter.shoot("sidebar.enable")
		else hunter.shoot("sidebar.disable")

		if (!visible || !enabled || !maoka_dom.guards.is_dom_node(node) || !node.value.parentElement) return null
		else return sidebar_render_picker()
	}
})

// --- Internal ---

const sidebar_render_picker = maoka.create("div", ({ use, node }) => {
	const { activities$ } = use(maoka_sdk.context.consume)
	use(maoka_sdk.jabs.classes.set("sidebar"))

	const get_current_activity = use(maoka_sdk.jabs.zags.cheat$(activities$, "current"))

	return async () => {
		const current_activity = get_current_activity()

		// TODO 404
		if (current_activity && current_activity.render_sidebar && maoka_dom.guards.is_dom_node(node)) {
			await current_activity.render_sidebar(node.value as HTMLDivElement)
		} else return null
	}
})
