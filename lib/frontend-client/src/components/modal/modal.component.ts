import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { ModalCloseButton } from "./close-button.component"
import { type TModalHook } from "../../hooks/use-modal.hook"

const div = create<TModalHook & TOrdoHooks>("div")

export const Modal = div(use => {
	const { modal } = use.get_modal_state()

	use.set_class(
		modal.is_some
			? "relative min-h-8 w-full max-w-3xl rounded-lg bg-neutral-100 shadow-lg dark:bg-neutral-700"
			: "hidden",
	)

	const element = use.get_current_element()

	use.event_listener("onclick", event => {
		if (!modal.is_some) return

		event.stopPropagation()
	})

	modal.is_some ? modal.unwrap()?.render(element as HTMLDivElement) : use.set_inner_html("")

	return ModalCloseButton
})
