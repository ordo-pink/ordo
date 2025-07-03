import { bs_arrow_left, bs_layout_sidebar_inset_reverse } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/sweech"

import { sidebar$ } from "../workspace.state"

export const sidebar_toggle = maoka.create("button", ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)
	const get_sidebar = use(maoka_sdk.jabs.zags.marry$(sidebar$))
	const translate = use(maoka_sdk.jabs.t$)

	use(maoka_sdk.jabs.classes.set("sidebar-toggle hidden"))
	use(maoka_sdk.jabs.listen("onclick", () => hunter.shoot("sidebar.toggle")))

	return () => {
		const { visible, enabled } = get_sidebar()

		const t_title = translate(visible ? "sidebar_commands_hide_title" : "sidebar_commands_show_title")

		use(maoka_sdk.jabs.set_attribute("title", t_title))
		if (enabled) use(maoka_sdk.jabs.classes.replace("hidden", "visible"))
		else use(maoka_sdk.jabs.classes.replace("visible", "hidden"))

		return sweech
			.of_true()
			.case(enabled && visible, () => bs_arrow_left({ classes: "sidebar-toggle_icon" })) // TODO Extract to class name
			.case(enabled && !visible, () => bs_layout_sidebar_inset_reverse())
			.default(() => null)
	}
})
