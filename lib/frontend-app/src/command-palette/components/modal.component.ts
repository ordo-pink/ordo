import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_question_circle } from "@ordo-pink/frontend-icons"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { hotkey } from "@ordo-pink/core"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { app_context } from "../../../app-context"
import { command_palette$ } from "../command-palette.state"
import { command_palette_item } from "./item.component"
import { command_palette_search } from "./search.component"

export const modal = maoka.create("div", ({ use }) => {
	let current_item_index = 0
	let current_location: internal.LOCATION = internal.LOCATION.ITEMS

	const is_darwin = use(maoka_jabs.is_darwin)
	const { hunter } = use(app_context.consume)
	const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))

	const handle_click = (event: MouseEvent) => event.stopPropagation()
	const handle_global_keydown = (event: KeyboardEvent) => {
		if (internal.IGNORED_KEYS.includes(event.key)) return

		const current = get_current()

		if (current && event.code === "Escape") return void hunter.shoot("command_palette.hide")

		const parsed_hotkey = create_hotkey_from_event(event, is_darwin)

		if (current) {
			if (current.is_multiple && event.code === "Tab") {
				current_location =
					current_location === internal.LOCATION.ITEMS ? internal.LOCATION.PINNED_ITEMS : internal.LOCATION.ITEMS
				use(maoka_dom.jabs.refresh$)
				return
			}

			if (event.code === "ArrowDown") {
				current_item_index = current_item_index === current.items.length - 1 ? 0 : current_item_index + 1
				use(maoka_dom.jabs.refresh$)
				return
			}

			if (event.code === "ArrowUp") {
				current_item_index = current_item_index === 0 ? current.items.length - 1 : current_item_index - 1
				use(maoka_dom.jabs.refresh$)
				return
			}

			if (event.code === "Enter") {
				current.on_select(current.items[current_item_index])
				hunter.shoot("command_palette.hide")
			}

			for (let i = 0; i < current.items.length; i++) {
				const item = current.items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					current.on_select(item)
					break
				}
			}
		} else {
			const global_items = command_palette$.select("items")

			for (let i = 0; i < global_items.length; i++) {
				const item = global_items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					item.value()
					break
				}
			}
		}
	}

	use(maoka_jabs.set_id("cp"))
	use(maoka_jabs.set_class("command-palette"))
	use(maoka_jabs.listen("onclick", handle_click))
	use(maoka_jabs.listen_global_event("keydown", handle_global_keydown))

	return () => {
		const current = get_current()

		if (!current) return null

		return [
			command_palette_search(),
			// TODO open via route fragment and query
			// TODO create subitems if item is found with fuzzy search but the match is not exact
			current.is_multiple
				? internal.items_wrapper(() => [
						internal.items(() =>
							current.items.map((item, index) =>
								command_palette_item({
									item,
									active: current_location === internal.LOCATION.ITEMS && index === current_item_index,
								}),
							),
						),
						internal.items(() =>
							current.pinned_items?.map((item, index) =>
								command_palette_item({
									item,
									active: current_location === internal.LOCATION.PINNED_ITEMS && index === current_item_index,
								}),
							),
						),
					])
				: internal.items(() =>
						current.items.map((item, index) =>
							command_palette_item({
								item,
								active: current_location === internal.LOCATION.ITEMS && index === current_item_index,
							}),
						),
					),
			internal.footer(() => [
				bs_question_circle({ classes: "mr-2" }),
				internal.text_span(() => "Type to search. Arrows to navigate."),
				hotkey({ hotkey: "enter", decoration_only: true }),
				internal.text_span(() => "to select item."),
				hotkey({ hotkey: "escape", decoration_only: true }),
				internal.text_span(() => "to close."),
			]),
		]
	}
})

namespace internal {
	export enum LOCATION {
		ITEMS,
		PINNED_ITEMS,
	}

	export const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

	export const text_span = maoka_styled.span()
	export const footer = maoka_styled.div("command-palette_footer")
	export const items_wrapper = maoka_styled.div("command-palette_items_multiple-wrapper")
	export const items = maoka_styled.div("command-palette_items")
}
