import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { sidebar } from "./components/sidebar.component"
import { sidebar$ } from "./sidebar.state"
import { sidebar_toggle } from "./components/sidebar-activity-bar-toggle.component"
import { workspace } from "./components/workspace.component"

export const create_sidebar_jab: Maoka.Jab<{
	sidebar: () => Maoka.Component
	sidebar_toggle: () => Maoka.Component
	workspace: () => Maoka.Component
}> = ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	const handle_mount = () => {
		const release_disable = hunter.track("sidebar.disable", handle_disable_sidebar)
		const release_enable = hunter.track("sidebar.enable", handle_enable_sidebar)
		const release_hide = hunter.track("sidebar.hide", handle_hide_sidebar)
		const release_show = hunter.track("sidebar.show", handle_show_sidebar)
		const release_toggle = hunter.track("sidebar.toggle", handle_toggle_sidebar)

		return () => {
			release_disable()
			release_enable()
			release_hide()
			release_show()
			release_toggle()
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))

	return { sidebar, sidebar_toggle, workspace }
}

// --- Internal ---

const handle_disable_sidebar = () => sidebar$.update("enabled", () => false)
const handle_enable_sidebar = () => sidebar$.update("enabled", () => true)
const handle_hide_sidebar = () => sidebar$.update("visible", () => false)
const handle_show_sidebar = () => sidebar$.update("visible", () => true)
const handle_toggle_sidebar = () => void (sidebar$.select("enabled") && sidebar$.update("visible", prev => !prev))
