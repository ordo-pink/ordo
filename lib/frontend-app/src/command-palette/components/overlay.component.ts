import { maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { context } from "@ordo-pink/sdk-maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { command_palette$ } from "../command-palette.state"

/**
 * Command palett overlay that blurs out the background content and handles clicks to close
 * the command palette.
 */
export const command_palette_overlay = maoka_styled.div("command-palette_wrapper", ({ use }) => {
	const { hunter } = use(context.consume)

	const handle_show = () => use(maoka_jabs.add_class("active"))
	const handle_hide = () => use(maoka_jabs.remove_class("active"))
	const handle_click = () => hunter.shoot("command_palette.hide")
	const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

	use(maoka_jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))
})
