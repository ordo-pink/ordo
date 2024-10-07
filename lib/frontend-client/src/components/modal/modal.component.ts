import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ModalCloseButton } from "./close-button.component"

export const Modal = (modal: Ordo.Modal.Instance | null) =>
	Maoka.create("div", ({ use, element: current_element }) => {
		use(
			MaokaJabs.listen("onclick", event => {
				if (!modal) return

				event.stopPropagation()
			}),
		)

		if (modal) modal.render(current_element as unknown as HTMLDivElement)

		return () => {
			use(
				MaokaJabs.set_class(
					modal
						? "relative min-h-8 max-w-3xl rounded-lg bg-neutral-100 shadow-xl dark:bg-neutral-700"
						: "hidden",
				),
			)
			return ModalCloseButton(modal?.show_close_button)
		}
	})
