import { Maoka, maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { app_context } from "@ordo-pink/frontend-app/app-context"
import { command_palette$ } from "./command-palette.state"

export const command_palette = () =>
	internal.command_palette_wrapper(() =>
		internal.command_palette_window(() => [
			internal.command_palette_search(),
			internal.command_palette_items_div(() => () => "Items"),
			internal.command_palette_footer_div(() => () => "Footer"),
		]),
	)

namespace internal {
	export const command_palette_wrapper: Maoka.Teacher = kindergarten =>
		styled.command_palette_wrapper(use => {
			const { hunter } = use(app_context.consume)

			const handle_show = () => use(maoka_jabs.add_class("active"))
			const handle_hide = () => use(maoka_jabs.remove_class("active"))
			const handle_click = () => hunter.shoot("command_palette.hide")
			const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

			use(maoka.jabs.onmount(handle_mount))
			use(maoka_jabs.listen("onclick", handle_click))

			return kindergarten
		})

	export const command_palette_window: Maoka.Teacher = kindergarten =>
		styled.command_palette_window(use => {
			const handle_click = (event: MouseEvent) => event.stopPropagation()

			const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))

			use(maoka_jabs.set_id("cp"))
			use(maoka_jabs.listen("onclick", handle_click))

			return () => get_current() && kindergarten()
		})

	export const command_palette_search = () =>
		command_palette_form(() =>
			styled.command_palette_input(use => {
				const t_search = "Search..." // TODO i18n

				const handle_mount = () => use(maoka.jabs.if_dom(n => n.value.focus()))

				use(maoka.jabs.onmount(handle_mount))
				use(maoka_jabs.set_id("cp-input"))
				use(maoka_jabs.set_attribute("placeholder", t_search))
				use(maoka_jabs.set_attribute("autocomplete", "off"))
			}),
		)

	const command_palette_form: Maoka.Teacher = kindergarten =>
		styled.command_palette_form(use => {
			const handle_submit = (event: Event) => event.preventDefault()

			use(maoka_jabs.set_id("cp-form"))
			use(maoka_jabs.listen("onsubmit", handle_submit))

			return kindergarten
		})

	export const command_palette_items_div = maoka.styled.div("command-palette_items")
	export const command_palette_footer_div = maoka.styled.div("command-palette_footer")

	namespace styled {
		export const command_palette_form = maoka.styled.form("command-palette_form")
		export const command_palette_input = maoka.styled.input("command-palette_search")
		export const command_palette_window = maoka.styled.div("command-palette")
		export const command_palette_wrapper = maoka.styled.div("command-palette_wrapper")
	}
}
