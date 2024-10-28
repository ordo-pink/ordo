import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { CommandPaletteItem } from "./command-palette-item.component"
import { CurrentItemLocation } from "./constants"

export const CommandPaletteItems = (
	items$: Observable<Ordo.CommandPalette.Item[]>,
	index$: Observable<number>,
	location$: Observable<CurrentItemLocation>,
	assigned_location: CurrentItemLocation,
) =>
	Maoka.create("div", ({ use }) => {
		const get_items = use(MaokaOrdo.Jabs.from$(items$, []))
		const get_current_selection = use(MaokaOrdo.Jabs.from$(index$, 0))
		const get_location = use(MaokaOrdo.Jabs.from$(location$, CurrentItemLocation.SUGGESTED))

		use(MaokaJabs.set_class("command-palette_items"))

		return () => {
			const current_selection = get_current_selection()
			const items = get_items()
			const location = get_location()

			return items.map((item, index) =>
				CommandPaletteItem(item, location === assigned_location && current_selection === index),
			)
		}
	})
