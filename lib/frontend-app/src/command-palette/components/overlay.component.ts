import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { app_context } from "../../../app-context"
import { command_palette$ } from "../command-palette.state"

export const overlay = maoka.create("div", ({ kindergarten, use }) => {
	const { hunter } = use(app_context.consume)

	const handle_show = () => use(maoka_jabs.add_class("active"))
	const handle_hide = () => use(maoka_jabs.remove_class("active"))
	const handle_click = () => hunter.shoot("command_palette.hide")
	const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

	use(maoka_jabs.set_class("command-palette_wrapper"))
	use(maoka_jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))

	return kindergarten
})
