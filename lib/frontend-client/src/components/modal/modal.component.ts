import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ModalCloseButton } from "./close-button.component"

export const Modal = (modal: Ordo.Modal.Instance | null) =>
	Maoka.create("div", ({ use, element: current_element }) => {
		use(MaokaJabs.set_class("modal"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		if (modal) modal.render(current_element as unknown as HTMLDivElement)

		const handle_click = (event: MouseEvent) => {
			if (!modal) return
			event.stopPropagation()
		}

		return () => {
			if (modal) use(MaokaJabs.add_class("active"))
			else use(MaokaJabs.remove_class("active"))

			return ModalCloseButton(modal?.show_close_button)
		}
	})
