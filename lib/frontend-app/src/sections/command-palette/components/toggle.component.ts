import { context, maoka_sdk } from "@ordo-pink/sdk-maoka"
import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"

import { activity_bar_icon } from "../../activity-bar/components/activity-bar-icon.component"

export const command_palette_toggle = maoka.create("div", ({ use, node }) => {
	const { hunter } = use(context.consume)

	const render_icon = (span: HTMLSpanElement) => maoka_dom.render(span, bs_menu_button_wide_fill(), node.root.create_id)
	const is_current = false
	const readable_name = "command_palette_name"

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		hunter.shoot("command_palette.toggle")
	}
	const handle_keydown = (event: KeyboardEvent) => {
		if (maoka_dom.guards.is_dom_node(node) && event.code === "Enter") {
			event.stopPropagation()
			hunter.shoot("command_palette.toggle")
		}
	}

	use(maoka_sdk.jabs.classes.set("activity-bar_link"))
	use(maoka_sdk.jabs.set_attribute("tabindex", "1"))
	use(maoka_sdk.jabs.listen("onclick", handle_click))
	use(maoka_sdk.jabs.listen("onkeydown", handle_keydown))

	return () => activity_bar_icon({ is_current, render_icon, readable_name })
})
