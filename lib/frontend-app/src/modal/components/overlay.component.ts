import * as maoka_sdk from "@ordo-pink/sdk-maoka"

import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { modal$ } from "../modal.state"

export const overlay = maoka.create("div", ({ kindergarten, use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	const handle_show = () => use(maoka_jabs.add_class("active"))
	const handle_hide = () => use(maoka_jabs.remove_class("active"))
	const handle_click = () => hunter.shoot("modal.hide")
	const handle_mount = () => modal$.cheat("instance", instance => (instance ? handle_show() : handle_hide()))

	use(maoka_jabs.set_class("modal_wrapper"))
	use(maoka_jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))

	return kindergarten
})
