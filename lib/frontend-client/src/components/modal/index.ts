import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { Modal } from "./modal.component"
import { type TModalHook } from "../../hooks/use-modal.hook"

const div = create<TModalHook & TOrdoHooks>("div")

export const ModalOverlay = div(use => {
	const commands = use.commands()

	const { modal, prev_modal } = use.get_modal_state()

	modal.unwrap()?.on_unmount?.()

	use.set_class(get_overlay_class(modal.is_some))

	use.event_listener("onclick", event => {
		if (modal.is_none) return

		event.stopPropagation()
		prev_modal.unwrap()?.on_unmount?.()
		commands.emit("cmd.application.modal.hide")
	})

	use.on_mount(() => {
		const on_esc_key_press = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return

			event.stopPropagation()
			commands.emit("cmd.application.modal.hide")
		}

		document.addEventListener("keydown", on_esc_key_press)

		return () => {
			document.removeEventListener("keydown", on_esc_key_press)
		}
	})

	return Modal
})

const get_overlay_class = (is_visible: boolean) =>
	is_visible
		? "flex items-center justify-center h-[100dvh] w-[100dvw] fixed inset-0 z-[500] overflow-hidden p-4 bg-gradient-to-tr from-neutral-900/80 to-stone-900/80"
		: "hidden"
