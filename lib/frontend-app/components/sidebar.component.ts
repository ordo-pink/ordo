import { BsArrowLeft, BsLayoutSidebarInsetReverse } from "@ordo-pink/frontend-icons"
import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

ordo_app_state.zags.update("sections", prev => ({ ...prev, sidebar: OrdoSidebarStatus.DISABLED }))

export const OrdoSidebar = Maoka.create("aside", ({ use, on_unmount }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_status = use(ordo_app_state.select_jab$("sections.sidebar"))

	commands.on("cmd.application.sidebar.disable", handle_disable_sidebar)
	commands.on("cmd.application.sidebar.enable", handle_enable_sidebar)
	commands.on("cmd.application.sidebar.hide", handle_hide_sidebar)
	commands.on("cmd.application.sidebar.show", handle_show_sidebar)
	commands.on("cmd.application.sidebar.toggle", handle_toggle_sidebar)

	on_unmount(() => {
		commands.off("cmd.application.sidebar.disable", handle_disable_sidebar)
		commands.off("cmd.application.sidebar.enable", handle_enable_sidebar)
		commands.off("cmd.application.sidebar.hide", handle_hide_sidebar)
		commands.off("cmd.application.sidebar.show", handle_show_sidebar)
		commands.off("cmd.application.sidebar.toggle", handle_toggle_sidebar)
	})

	return () => {
		const status = get_status()

		return Switch.Match(status)
			.case(OrdoSidebarStatus.VISIBLE, () => Sidebar)
			.case(OrdoSidebarStatus.HIDDEN, noop) // TODO Hidden enabled sidebar state
			.default(noop)
	}
})

export const OrdoSidebarButton = Maoka.create("button", ({ use }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_status = use(ordo_app_state.select_jab$("sections.sidebar"))

	use(MaokaJabs.set_class("activity-bar_link activity-bar_icon"))
	use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.toggle")))

	return () => {
		const status = get_status()

		return Switch.Match(status)
			.case(OrdoSidebarStatus.VISIBLE, () => BsArrowLeft("rotate-180") as TMaokaElement)
			.case(OrdoSidebarStatus.HIDDEN, () => BsLayoutSidebarInsetReverse() as TMaokaElement)
			.default(noop)
	}
})

export enum OrdoSidebarStatus {
	DISABLED,
	HIDDEN,
	VISIBLE,
	length,
}

// --- Internal ---

const Sidebar = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("sidebar"))

	return () => ["Sidebar"]
})

const handle_disable_sidebar = () => ordo_app_state.zags.update("sections.sidebar", () => OrdoSidebarStatus.DISABLED)
const handle_enable_sidebar = () => ordo_app_state.zags.update("sections.sidebar", () => OrdoSidebarStatus.VISIBLE)
const handle_show_sidebar = () => ordo_app_state.zags.update("sections.sidebar", () => OrdoSidebarStatus.VISIBLE)
const handle_hide_sidebar = () => ordo_app_state.zags.update("sections.sidebar", () => OrdoSidebarStatus.HIDDEN)
const handle_toggle_sidebar = () =>
	ordo_app_state.zags.update("sections.sidebar", prev_status =>
		Switch.Match(prev_status)
			.case(OrdoSidebarStatus.VISIBLE, () => OrdoSidebarStatus.HIDDEN)
			.case(OrdoSidebarStatus.HIDDEN, () => OrdoSidebarStatus.VISIBLE)
			.default(() => OrdoSidebarStatus.DISABLED),
	)
