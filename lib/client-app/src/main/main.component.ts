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

	use(ordo_client_maoka.jabs.set_class("activity-bar_icon sidebar-toggle hidden"))
	use(ordo_client_maoka.jabs.listen("onclick", () => hunter.shoot("sidebar.toggle")))

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

// TODO Automatically close sidebar in mobile if something was clicked
const sidebar = maoka.create("aside", ({ use, node }) => {
	const { query, hunter } = use(ordo_client_maoka.context.consume)
	const get_sidebar = use(ordo_client_maoka.jabs.marry$(sidebar$))
	const get_current_activity = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))
	const is_mobile = use(ordo_client_maoka.jabs.is_mobile)

	const handle_click = () => is_mobile && hunter.shoot("sidebar.hide")

	use(ordo_client_maoka.jabs.listen("onclick", handle_click))

	return () => {
		const { visible, enabled } = get_sidebar()

		const current_activity = get_current_activity()

		if (current_activity && current_activity.render_sidebar) hunter.shoot("sidebar.enable")
		else hunter.shoot("sidebar.disable")

		if (!visible || !enabled || !maoka_dom.node_guard(node) || !node.value.parentElement) return null
		else return sidebar_render_picker()
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

const workspace = maoka.create("main", ({ use, node }) => {
	const { query } = use(ordo_client_maoka.context.consume)

	use(ordo_client_maoka.jabs.set_class("workspace"))

	const get_current_activity = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))

	return () => {
		const activity = get_current_activity()

		return [workspace_renderer({ activity }), sidebar_padding_contractor({ parent_node: node })]
	}
})

// --- Internal ---

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

export const create_workspace: Maoka.Jab<{
	sidebar: () => Maoka.Component
	sidebar_toggle: () => Maoka.Component
	workspace: () => Maoka.Component
}> = ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_mount = () => {
		const release_disable = hunter.track("sidebar.disable", () => sidebar$.update("enabled", () => false))
		const release_enable = hunter.track("sidebar.enable", () => sidebar$.update("enabled", () => true))
		const release_hide = hunter.track("sidebar.hide", () => sidebar$.update("visible", () => false))
		const release_show = hunter.track("sidebar.show", () => sidebar$.update("visible", () => true))
		const release_toggle = hunter.track(
			"sidebar.toggle",
			() => void (sidebar$.select("enabled") && sidebar$.update("visible", prev => !prev)),
		)

		hunter.shoot("command_palette.add", {
			id: SIDEBAR.TOGGLE_COMMAND_ID,
			value: () => hunter.shoot("sidebar.toggle"),
			hotkey: "mod+b",
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.COMMON_ACTION,
			readable_name: "sidebar_commands_toggle_title",
			description: "sidebar_commands_toggle_description",
			render_icon: span => maoka_dom.render(span, bs_layout_sidebar_inset_reverse(), () => crypto.randomUUID()),
		})

		hunter.shoot("i18n.add_translations", {
			locale: "en",
			values: {
				sidebar_commands_hide_title: "Hide Sidebar",
				sidebar_commands_hide_description: "Hide sidebar away from the sight!",
				sidebar_commands_show_title: "Show Sidebar",
				sidebar_commands_show_description: "Show the annoying thing on the right. Why isn't it on the left tho?",
				sidebar_commands_toggle_title: "Toggle Sidebar",
				sidebar_commands_toggle_description: "Show or hide Sidebar depending on whether it is, well, hidden or shown.",
			},
		})

		// hunter.shoot("cmd.application.context_menu.add", {
		// 	command: "cmd.application.sidebar.hide",
		// 	readable_name: "t.common.components.sidebar.hide",
		// 	type: CONTEXT_MENU_ITEM_TYPE.UPDATE,
		// 	should_show: ({ event }) => MaokaDOM.is_maoka_dom_element(event.target) && !!event.target.closest(".sidebar"),
		// 	render_icon: () => bs_arrow_left("rotate-180"),
		// })

		return () => {
			release_disable()
			release_enable()
			release_hide()
			release_show()
			release_toggle()

			hunter.shoot("command_palette.remove", SIDEBAR.TOGGLE_COMMAND_ID)

			hunter.shoot("i18n.remove_translations", [
				"sidebar_commands_hide_description",
				"sidebar_commands_hide_title",
				"sidebar_commands_show_description",
				"sidebar_commands_show_title",
				"sidebar_commands_toggle_description",
				"sidebar_commands_toggle_title",
			])
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))

	return { sidebar, sidebar_toggle, workspace }
}

export namespace SIDEBAR {
	export const TOGGLE_COMMAND_ID = "sidebar_toggle"
}

export const sidebar$ = zags.create<Sidebar.State>({
	enabled: false,
	visible: window.innerWidth >= ORDO_CLIENT.SM_SCREEN_BREAKPOINT,
})

export namespace Sidebar {
	export type State = {
		enabled: boolean
		visible: boolean
	}
}
