import { Maoka, maoka } from "@ordo-pink/maoka"

import { app_context } from "../../app-context"
import { command_palette } from "./command-palette.component"
import { command_palette$ } from "./command-palette.state"

import "./command-palette.style.css"

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

			return () => {
				release_add()
				release_hide()
				release_remove()
				release_show()
				release_toggle()
			}
		}

		use(maoka.jabs.onmount(handle_onmount))
	}

	// TODO Check how to select global items
	const global_palette = (): Ordo.CommandPalette.Instance => ({
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
