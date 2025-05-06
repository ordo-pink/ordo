import { maoka, maoka_styled } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { COMMAND_PALETTE_SECTION, FUZZY_CHECK_RATIO } from "../command-palette.contants"
import { command_palette$ } from "../command-palette.state"
import { command_palette_item } from "./item.component"
import { fuzzy_check } from "@ordo-pink/tau"

export const command_palette_items = maoka.create("div", ({ use }) => {
	const get_state = use(maoka_jabs.marry$(command_palette$))

	use(maoka_jabs.set_class("command-palette_items_multiple-wrapper"))

	return () => {
		const state = get_state()

		if (!state.current) return null

		const visible_items = state.current.items.filter(i => fuzzy_check(i.readable_name, state.search_value, FUZZY_CHECK_RATIO))

		if (!visible_items.length)
			return internal.nothing_found_div(() => `Nothing matches the search term "${state.search_value}"`)

		if (!state.current.is_multiple)
			return internal.items(() =>
				visible_items.map((item, index) => command_palette_item({ active: state.index === index, item })),
			)

		return [
			internal.items(() =>
				state.items.map((item, index) =>
					command_palette_item({ active: state.location === COMMAND_PALETTE_SECTION.ITEMS && state.index === index, item }),
				),
			),
			internal.items(() =>
				state.current!.pinned_items?.map((item, index) =>
					command_palette_item({
						active: state.location === COMMAND_PALETTE_SECTION.PINNED_ITEMS && state.index === index,
						item,
					}),
				),
			),
		]
	}
})

namespace internal {
	export const items = maoka_styled.div("command-palette_items")

	export const nothing_found_div = maoka_styled.div("command-palette_items_nothing-found")
}
