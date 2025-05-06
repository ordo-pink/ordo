import { Maoka, maoka_dom } from "@ordo-pink/maoka"

import { app_context } from "../../app-context"
import { close_modal } from "./components/close-modal.component"
import { modal } from "./components/modal.component"
import { modal$ } from "./modal.state"
import { overlay } from "./components/overlay.component"

export const create_modal_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	use(internal.track_prey_jab)

	return () => overlay(() => [modal(), close_modal()])
}

namespace internal {
	export const track_prey_jab: Maoka.Jab = ({ use }) => {
		const { hunter } = use(app_context.consume)

		const handle_mount = () => {
			const release_show = hunter.track("modal.show", params => modal$.update("instance", () => params))
			const release_hide = hunter.track("modal.hide", () => modal$.update("instance", () => void 0))

			return () => {
				release_hide()
				release_show()
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
}
