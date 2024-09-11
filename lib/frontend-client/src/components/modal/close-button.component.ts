import { BS_X } from "@ordo-pink/frontend-icons"
import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { type TModalHook } from "../../hooks/use-modal.hook"

const button = create<TModalHook & TOrdoHooks>("button")

export const ModalCloseButton = button(use => {
	const { modal } = use.get_modal_state()

	if (modal.is_none) return

	const commands = use.commands()

	use.set_class(
		"absolute right-0 top-0 cursor-pointer p-2",
		"text-neutral-500 hover:text-pink-500 transition-colors duration-300",
	)

	use.event_listener("onclick", event => {
		event.preventDefault()
		commands.emit("cmd.application.modal.hide")
	})

	use.set_inner_html(BS_X)
})
