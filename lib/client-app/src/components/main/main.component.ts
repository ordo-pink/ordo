/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { type MaokaDom, maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { bs_arrow_left, bs_layout_sidebar_inset_reverse } from "@ordo-pink/frontend-icons"
import { sweech } from "@ordo-pink/oss-sweech"
import { zags } from "@ordo-pink/oss-zags"

import "./main.styles.css"

export const sidebar_toggle = maoka.create("button", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const get_sidebar = use(ordo_client_maoka.jabs.marry$(sidebar$))
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("icon sidebar-toggle"))
	use(ordo_client_maoka.jabs.set_attribute("tabindex", "3"))
	use(ordo_client_maoka.jabs.listen("click", () => hunter.shoot("ordo_main.sidebar.toggle")))

	return () => {
		const { visible, enabled } = get_sidebar()

		const t_title = translate(visible ? "sidebar_commands_hide_title" : "sidebar_commands_show_title")

		use(ordo_client_maoka.jabs.set_attribute("title", t_title))
		if (enabled) use(ordo_client_maoka.jabs.replace_class("hidden", "visible"))
		else use(ordo_client_maoka.jabs.replace_class("visible", "hidden"))

		return sweech
			.of_true()
			.case(enabled && visible, () => bs_arrow_left({ classes: "sidebar-toggle_icon" }))
			.case(enabled && !visible, () => bs_layout_sidebar_inset_reverse())
			.default(() => null)
	}
})

export const sidebar = maoka.create("aside", ({ use, node }) => {
	const { query, hunter } = use(ordo_client_maoka.context.consume)
	const is_mobile = use(ordo_client_maoka.jabs.is_mobile)
	const get_sidebar$ = use(ordo_client_maoka.jabs.marry$(sidebar$))
	const get_current_activity$ = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))

	const handle_click = () => is_mobile && hunter.shoot("ordo_main.sidebar.hide")

	const handle_disable: OrdoClient.Command.GunFor<"ordo_main.sidebar.disable"> = () => sidebar$.update("enabled", () => false)
	const handle_enable: OrdoClient.Command.GunFor<"ordo_main.sidebar.enable"> = () => sidebar$.update("enabled", () => true)
	const handle_hide: OrdoClient.Command.GunFor<"ordo_main.sidebar.hide"> = () => sidebar$.update("visible", () => false)
	const handle_show: OrdoClient.Command.GunFor<"ordo_main.sidebar.show"> = () => sidebar$.update("visible", () => true)
	const handle_toggle: OrdoClient.Command.GunFor<"ordo_main.sidebar.toggle"> = () =>
		void (sidebar$.select("enabled") && sidebar$.update("visible", prev => !prev))

	use(ordo_client_maoka.jabs.listen("click", () => handle_click()))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.sidebar.disable", handle_disable))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.sidebar.enable", handle_enable))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.sidebar.hide", handle_hide))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.sidebar.show", handle_show))
	use(ordo_client_maoka.jabs.handle_command("ordo_main.sidebar.toggle", handle_toggle))
	use(ordo_client_maoka.jabs.add_translations("en", en_values))

	return () => {
		const { visible, enabled } = get_sidebar$()

		const current_activity = get_current_activity$()

		if (current_activity && current_activity.render_sidebar) hunter.shoot("ordo_main.sidebar.enable")
		else hunter.shoot("ordo_main.sidebar.disable")

		if (!visible || !enabled || !maoka_dom.node_guard(node) || !node.value.parentElement) {
			// TODO Add or remove cp sidebar toggler
			use(ordo_client_maoka.jabs.add_class("hidden"))
			hunter.shoot("ordo_main.command_palette.remove", "sidebar.toggle")

			return null
		} else {
			use(ordo_client_maoka.jabs.remove_class("hidden"))
			hunter.shoot("ordo_main.command_palette.add", {
				id: "sidebar.toggle",
				readable_name: "sidebar_commands_toggle_title",
				value: () => hunter.shoot("ordo_main.sidebar.toggle"),
				hotkey: "mod+b",
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.COMMON_ACTION,
				description: "sidebar_commands_toggle_description",
				render_icon: span => maoka_dom.render(span, bs_layout_sidebar_inset_reverse(), () => crypto.randomUUID()),
			})

			return sidebar_render_picker()
		}
	}
})

export const workspace = maoka.create("main", ({ use, node }) => {
	const { query } = use(ordo_client_maoka.context.consume)

	use(ordo_client_maoka.jabs.set_class("workspace"))

	const get_current_activity = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))

	return () => {
		const activity = get_current_activity()

		return [workspace_renderer({ activity }), sidebar_padding_contractor({ parent_node: node })]
	}
})

// --- Internal ---

const sidebar_render_picker = maoka.create("div", ({ use, node }) => {
	const { query } = use(ordo_client_maoka.context.consume)
	use(ordo_client_maoka.jabs.set_class("sidebar"))

	const get_current_activity = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))

	return async () => {
		const current_activity = get_current_activity()

		// TODO 404
		if (current_activity && current_activity.render_sidebar && maoka_dom.node_guard(node)) {
			await current_activity.render_sidebar(node.value as HTMLDivElement)
		} else return null
	}
})

const sidebar_padding_contractor = maoka.create<{ parent_node: Maoka.Node }>("div", ({ parent_node, use }) => {
	const get_sidebar = use(ordo_client_maoka.jabs.marry$(sidebar$))

	return () => {
		const sidebar = get_sidebar()

		if (maoka_dom.node_guard(parent_node))
			sweech
				.of_true()
				.case(sidebar.enabled && sidebar.visible, () => parent_node.value.classList.remove("no-sidebar"))
				.default(() => parent_node.value.classList.add("no-sidebar"))
	}
})

const workspace_renderer = maoka.create<{ activity?: OrdoClient.Activity.Instance }>("div", ({ activity, node, use }) => {
	use(ordo_client_maoka.jabs.set_class("h-full")) // TODO Move to CSS

	const handle_onmount = (n: MaokaDom.DomNode<HTMLElement>) => {
		if (activity && activity.render_workspace && maoka_dom.node_guard(node))
			void activity.render_workspace(node.value as HTMLDivElement)
		else n.value.innerHTML = "" // TODO 404
	}

	use(maoka_dom.jabs.onmount(handle_onmount))
})

const sidebar$ = zags.create<{ enabled: boolean; visible: boolean }>({
	enabled: false,
	visible: window.innerWidth >= ORDO_CLIENT.SM_SCREEN_BREAKPOINT,
})

const en_values = {
	sidebar_commands_hide_title: "Hide Sidebar",
	sidebar_commands_hide_description: "Hide sidebar away from the sight!",
	sidebar_commands_show_title: "Show Sidebar",
	sidebar_commands_show_description: "Show the annoying thing on the right. Why isn't it on the left tho?",
	sidebar_commands_toggle_title: "Toggle Sidebar",
	sidebar_commands_toggle_description: "Show or hide Sidebar depending on whether it is, well, hidden or shown.",
}
