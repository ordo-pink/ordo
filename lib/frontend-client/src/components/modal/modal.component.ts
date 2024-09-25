import { Maoka } from "@ordo-pink/maoka"

import { ModalCloseButton } from "./close-button.component"

export const Modal = (modal: Client.Modal.ModalPayload | null) =>
	Maoka.create("div", ({ use, current_element }) => {
		use(
			Maoka.hooks.listen("onclick", event => {
				if (!modal) return

				event.stopPropagation()
			}),
		)

		if (modal) modal.render(current_element as unknown as HTMLDivElement)

		return () => {
			use(
				Maoka.hooks.set_class(
					modal
						? "relative min-h-8 max-w-3xl rounded-lg bg-neutral-100 shadow-xl dark:bg-neutral-700"
						: "hidden",
				),
			)
			return ModalCloseButton(modal?.show_close_button)
		}
	})
