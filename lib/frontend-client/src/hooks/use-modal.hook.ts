import { type Observable, pairwise } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type TInitialiseHooks } from "@ordo-pink/maoka"

export type TModalHook = {
	get_modal_state: () => {
		modal: TOption<Client.Modal.ModalPayload>
		prev_modal: TOption<Client.Modal.ModalPayload>
	}
}

export const init_modal_hook = (
	modal$: Observable<TOption<Client.Modal.ModalPayload>>,
): TInitialiseHooks<TModalHook> => ({
	get_modal_state: use => {
		let modal_state_pair: [TOption<Client.Modal.ModalPayload>, TOption<Client.Modal.ModalPayload>] =
			[O.None(), O.None()]

		return () => {
			use.on_mount(() => {
				const subscription = modal$.pipe(pairwise()).subscribe(items => {
					modal_state_pair = items
					use.refresh$()
				})

				return () => {
					subscription.unsubscribe()
				}
			})

			return {
				modal: modal_state_pair[1],
				prev_modal: modal_state_pair[0],
			}
		}
	},
})
