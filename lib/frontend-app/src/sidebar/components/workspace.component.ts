import { type Maoka, maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/sweech"

import { sidebar$ } from "../sidebar.state"

export const workspace = maoka.create("main", ({ use, node }) => {
	use(maoka_sdk.jabs.classes.set("workspace"))

	return () => [workspace_renderer(), sidebar_padding_contractor({ parent_node: node })]
})

// --- Internal ---

const sidebar_padding_contractor = maoka.create<{ parent_node: Maoka.Node }>("div", ({ parent_node, use }) => {
	const get_sidebar = use(maoka_sdk.jabs.zags.marry$(sidebar$))

	return () => {
		const sidebar = get_sidebar()

		if (maoka_dom.guards.is_dom_node(parent_node))
			sweech
				.of_true()
				.case(sidebar.enabled && sidebar.visible, () => parent_node.value.classList.remove("no-sidebar"))
				.default(() => parent_node.value.classList.add("no-sidebar"))
	}
})

const workspace_renderer = maoka.create("div", ({ node, use }) => {
	const { activities$ } = use(maoka_sdk.context.consume)

	use(maoka_sdk.jabs.classes.set("h-full")) // TODO Move to CSS
	const get_current_activity = use(maoka_sdk.jabs.zags.cheat$(activities$, "current"))

	return async () => {
		const current_activity = get_current_activity()

		// TODO 404
		if (current_activity && current_activity.render_workspace && maoka_dom.guards.is_dom_node(node)) {
			await current_activity.render_workspace(node.value as HTMLDivElement)
		} else return null
	}
})
