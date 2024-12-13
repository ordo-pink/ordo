/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/**
 * A handler function that will be called as soon as you marry in ZAGS and then every time
 * the state of ZAGS is updated. The partner is provided with the whole ZAGS state object.
 *
 * @param $TState Current ZAGS state value.
 * @param boolean Indicates whether the partner call is due to state update.
 */
export type TPartner<$TState extends Record<string, unknown>> = (value: $TState, is_update: boolean) => void

/**
 * ZAGS instance.
 *
 * @param $TState ZAGS state to listen to. MUST be an object (`Record<string, any>>`).
 */
export type TZags<$TState extends Record<string, unknown>> = {
	/**
	 * Subscribe to ZAGS state updates. Returns an extracted `divorce` function for easier
	 * unsibscription maintenance.
	 *
	 * @param TPartner partner to be called when state updates. Also called when you marry.
	 */
	marry: (partner: TPartner<$TState>) => () => void

	/**
	 * Unsubscribe from ZAGS state updates.
	 *
	 * @param TPartner partner to stop receiving state updates.
	 */
	divorce: (partner: TPartner<$TState>) => void

	/**
	 * Update ZAGS state and call all married partners.
	 *
	 * @param $TState state update. May be partial state - then the old state and the new state
	 * will be merged.
	 */
	update: (state: Partial<$TState>) => void

	/**
	 * Returns a structured clone of ZAGS state. All `structuredClone` limitations apply.
	 */
	unwrap: () => $TState
}

/**
 * ZAGS is a object (`Record<string, any>`) state storage that you can subscribe to, and
 * get all the updates of the ZAGS state using a `partner` handler you provide to the
 * {@link TZags.marry marry} method. Use {@link TZags.divorce divorce} to unsubscribe.
 *
 * **NOTE**: ZAGS always calls the {@link TPartner partner} when you `marry`. The second
 * parameter accepted by the partner is a boolean flag that indicates whether the partner
 * call is due to update or not. If it is `false`, the partner was called on `marry`. If it
 * is `true`, the partner was called on state update.
 *
 * @example
 * ```typescript
 * import { ZAGS } from "@ordo-pink/zags"
 *
 * const zags = ZAGS.Of({ counter: 0 })
 * const partner = console.log
 *
 * zags.marry(partner) // { counter: 0 }, false
 *
 * zags.update({ counter: 1 }) // { counter: 1 }, true
 * zags.update({ counter: 2 }) // { counter: 2 }, true
 * zags.update({ counter: 3 }) // { counter: 3 }, true
 * zags.update({ counter: 4 }) // { counter: 4 }, true
 *
 * zags.divorce(partner)
 *
 * zags.update({ counter: 5 })
 * zags.update({ counter: 6 })
 *
 * zags.marry(partner) // { counter: 6 }, false
 * ```
 */
export type TZagsStatic = {
	/**
	 * Creates an instance of ZAGS with given `initial state` and, optionally, preset `partners`.
	 *
	 * @param initial_state state to initiate ZAGS with. MUST be an object (`Record<string, any>`)
	 * @param partners optional array of predefined partners. You can `divorce` them later if you have
	 * the reference to the partner.
	 */
	Of: <T extends Record<string, unknown>>(initial_state: T, partners?: TPartner<T>[]) => TZags<T>
}
