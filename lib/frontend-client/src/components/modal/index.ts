import { type Observable, pairwise } from "rxjs"

import { Ordo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TOption } from "@ordo-pink/option"

import { Modal } from "./modal.component"

export const ModalOverlay = (
	$: Observable<TOption<Client.Modal.ModalPayload>>,
	ctx: TCreateFunctionContext,
) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(ordo_context.provide(ctx))

		let modal_state: Client.Modal.ModalPayload | null = null
		let unmount_prev_state: () => void = () => void 0

		const commands = use(Ordo.Hooks.commands)

		const subscription = $.pipe(pairwise()).subscribe(([prev_state, state]) => {
			modal_state = state.unwrap() ?? null
			unmount_prev_state = prev_state.unwrap()?.on_unmount ?? (() => void 0)
			refresh()
		})

		use(
			Maoka.hooks.listen("onclick", event => {
				if (!modal_state) return
				event.stopPropagation()
				unmount_prev_state()
				commands.emit("cmd.application.modal.hide")
			}),
		)

		const on_esc_key_press = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return

			event.stopPropagation()
			commands.emit("cmd.application.modal.hide")
		}

		document.addEventListener("keydown", on_esc_key_press)

		on_unmount(() => {
			subscription.unsubscribe()
			document.removeEventListener("keydown", on_esc_key_press)
		})

		return () => {
			use(Maoka.hooks.set_class(get_overlay_class(!!modal_state)))

			return Modal(modal_state)
		}
	})

const get_overlay_class = (is_visible: boolean) =>
	is_visible
		? "fixed inset-0 z-[500] backdrop-blur-sm flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-tr from-neutral-900/50 to-stone-900/50 p-4"
		: "hidden"
