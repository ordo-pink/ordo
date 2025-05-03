import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { CommandPaletteItemType } from "@ordo-pink/core"

import { app_context } from "../../app-context"
import { command_palette } from "./command-palette.component"
import { command_palette$ } from "./command-palette.state"

import "./command-palette.style.css"
import { BsTerminal } from "@ordo-pink/frontend-icons"

export const create_command_palette: Maoka.Jab = use => {
	use(internal.track_prey)

	return command_palette()
}

namespace internal {
	export const track_prey: Maoka.Jab = use => {
		const { hunter } = use(app_context.consume)

		const handle_onmount = () => {
			const release_add = hunter.track("command_palette.add", guns.command_palette_add)
			const release_hide = hunter.track("command_palette.hide", guns.command_palette_hide)
			const release_remove = hunter.track("command_palette.remove", guns.command_palette_remove)
			const release_show = hunter.track("command_palette.show", guns.command_palette_show)
			const release_toggle = hunter.track("command_palette.toggle", guns.command_palette_toggle)

			hunter.shoot("command_palette.add", {
				id: COMMAND_PALETTE_TOGGLE_ID,
				readable_name: "Toggle command palette",
				value: () => hunter.shoot("command_palette.toggle"),
				hotkey: "mod+shift+p",
				description: "Show or hide command palette. Hides command palette if you can see this message.",
				type: CommandPaletteItemType.MODAL_OPENER,
				render_icon: span => maoka_dom.render(span, BsTerminal(), () => crypto.randomUUID()),
			})

			return () => {
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_TOGGLE_ID)

				release_add()
				release_hide()
				release_remove()
				release_show()
				release_toggle()
			}
		}

		use(maoka_dom.jabs.onmount(handle_onmount))
	}

	const COMMAND_PALETTE_TOGGLE_ID = "command_palette.toggle"

	// TODO Check how to select global items
	const global_palette = (): Ordo.CommandPalette.Instance<() => void> => ({
		items: command_palette$.select("items"),
		on_select: item => item.value(),
	})

	namespace guns {
		export const command_palette_add: Ordo.GunFor<"command_palette.add"> = item =>
			command_palette$.update("items", items => [...items, item])

		export const command_palette_hide: Ordo.GunFor<"command_palette.hide"> = () =>
			command_palette$.update("current", () => void 0)

		export const command_palette_remove: Ordo.GunFor<"command_palette.remove"> = id =>
			command_palette$.update("items", items => items.filter(i => i.id === id))

		export const command_palette_show: Ordo.GunFor<"command_palette.show"> = new_current => {
			command_palette$.update("current", () => new_current ?? global_palette())
		}

		export const command_palette_toggle: Ordo.GunFor<"command_palette.toggle"> = () =>
			command_palette$.update("current", current => (current ? void 0 : global_palette()))
	}
}
