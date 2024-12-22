import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaZAGS } from "@ordo-pink/maoka-zags"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

export enum OrdoSidebarStatus {
	DISABLED,
	HIDDEN,
	VISIBLE,
	length,
}

const maoka_sidebar_state = MaokaZAGS.Of({ status: OrdoSidebarStatus.DISABLED })

const handle_disable_sidebar = () => maoka_sidebar_state.zags.update("status", () => OrdoSidebarStatus.DISABLED)
const handle_enable_sidebar = () => maoka_sidebar_state.zags.update("status", () => OrdoSidebarStatus.VISIBLE)
const handle_show_sidebar = () => maoka_sidebar_state.zags.update("status", () => OrdoSidebarStatus.VISIBLE)
const handle_hide_sidebar = () => maoka_sidebar_state.zags.update("status", () => OrdoSidebarStatus.HIDDEN)
const handle_toggle_sidebar = () =>
	maoka_sidebar_state.zags.update("status", () =>
		Switch.Match(maoka_sidebar_state.zags.select("status"))
			.case(OrdoSidebarStatus.VISIBLE, () => OrdoSidebarStatus.HIDDEN)
			.case(OrdoSidebarStatus.HIDDEN, () => OrdoSidebarStatus.VISIBLE)
			.default(() => OrdoSidebarStatus.DISABLED),
	)

export const OrdoSidebar = Maoka.create("aside", ({ use, on_unmount }) => {
	const commands = ordo_app_state.zags.select("commands")

	const get_status = use(maoka_sidebar_state.select_jab$("status"))

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

const Sidebar = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("sidebar"))

	return () => "Sidebar"
})
