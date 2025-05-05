import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_search } from "@ordo-pink/frontend-icons"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

export const command_palette_search = maoka.create("label", ({ use }) => {
	use(maoka_jabs.set_class("command-palette_search_wrapper"))

	return () => [bs_search({ classes: "" }), search()]
})

const search = maoka_styled.input("command-palette_search", ({ use }) => {
	const t_search = "Search..." // TODO i18n

	const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))

	use(maoka_jabs.set_id("cp-input"))
	use(maoka_jabs.set_attribute("placeholder", t_search))
	use(maoka_jabs.set_attribute("autocomplete", "off"))
	use(maoka_dom.jabs.onmount(handle_mount))
})
