import { type Observable, pairwise } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TOption } from "@ordo-pink/option"

import { Modal } from "./modal.component"

import "./modal.css"

export const ModalOverlay = (
	$: Observable<TOption<Ordo.Modal.Instance>>,
	ctx: Ordo.CreateFunction.Params,
) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let modal_state: Ordo.Modal.Instance | null = null
		let unmount_prev_state: () => void = () => void 0

		type TModalState = TOption<Ordo.Modal.Instance>

		const commands = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.set_class("modal-overlay"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))
		use(MaokaOrdo.Jabs.subscribe($.pipe(pairwise()), (...state) => handle_modal_update(...state)))

		const handle_click = (event: MouseEvent) => {
			if (!modal_state) return
			event.stopPropagation()
			unmount_prev_state()
			commands.emit("cmd.application.modal.hide")
		}

		const handle_modal_update = ([prev_state, state]: [TModalState, TModalState]) => {
			modal_state = state.unwrap() ?? null
			unmount_prev_state = prev_state.unwrap()?.on_unmount ?? (() => void 0)
			void refresh()
		}

		const handle_esc_key_down = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return

			event.stopPropagation()
			commands.emit("cmd.application.modal.hide")
		}

		document.addEventListener("keydown", handle_esc_key_down)

		on_unmount(() => document.removeEventListener("keydown", handle_esc_key_down))

		return () => {
			if (modal_state) use(MaokaJabs.add_class("active"))
			else use(MaokaJabs.remove_class("active"))

			return Modal(modal_state)
		}
	})
