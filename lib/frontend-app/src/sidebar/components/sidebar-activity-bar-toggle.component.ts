import { bs_arrow_left, bs_layout_sidebar_inset_reverse } from "@ordo-pink/frontend-icons"
import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { COMMAND_PALETTE } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/sweech"

import { SIDEBAR } from "../sidebar.constants"
import { sidebar$ } from "../sidebar.state"

export const sidebar_toggle = maoka.create("button", ({ use }) => {
	const { activities$, hunter } = use(maoka_sdk.context.consume)
	const get_sidebar = use(maoka_sdk.jabs.zags.marry$(sidebar$))
	const get_current_activity = use(maoka_sdk.jabs.zags.cheat$(activities$, "current"))

	use(maoka_sdk.jabs.listen("onclick", () => hunter.shoot("sidebar.toggle")))

	return () => {
		const { visible, enabled } = get_sidebar()

		const current_activity = get_current_activity()

		if (enabled) {
			use(maoka_sdk.jabs.classes.add("activity-bar_link", "activity-bar_icon"))
			use(maoka_sdk.jabs.classes.remove("size-6", "invisible"))

			hunter.shoot("command_palette.add", {
				id: SIDEBAR.TOGGLE_COMMAND_ID,
				value: () => hunter.shoot("sidebar.toggle"),
				hotkey: "mod+b",
				type: COMMAND_PALETTE.ITEM_TYPE.COMMON_ACTION,
				readable_name: "sidebar_commands_toggle_title",
				description: "sidebar_commands_toggle_description",
				render_icon: span => maoka_dom.render(span, bs_layout_sidebar_inset_reverse(), () => crypto.randomUUID()),
			})

			// hunter.shoot("cmd.application.context_menu.add", {
			// 	command: "cmd.application.sidebar.hide",
			// 	readable_name: "t.common.components.sidebar.hide",
			// 	type: CONTEXT_MENU_ITEM_TYPE.UPDATE,
			// 	should_show: ({ event }) => MaokaDOM.is_maoka_dom_element(event.target) && !!event.target.closest(".sidebar"),
			// 	render_icon: () => bs_arrow_left("rotate-180"),
			// })
		} else {
			use(maoka_sdk.jabs.classes.remove("activity-bar_link", "activity-bar_icon"))
			use(maoka_sdk.jabs.classes.add("size-6", "invisible"))
			hunter.shoot("command_palette.remove", SIDEBAR.TOGGLE_COMMAND_ID)
		}

		if (current_activity && current_activity.render_sidebar) hunter.shoot("sidebar.enable")
		else hunter.shoot("sidebar.disable")

		return sweech
			.of_true()
			.case(enabled && visible, () => bs_arrow_left({ classes: "rotate-180" }))
			.case(enabled && !visible, () => bs_layout_sidebar_inset_reverse())
			.default(() => void 0)
	}
})
