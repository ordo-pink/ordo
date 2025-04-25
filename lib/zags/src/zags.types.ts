/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Zags {
	/**
	 * Expected Zags state. Must be a record.
	 */
	export type BaseState = Record<string, unknown>

	/**
	 * Partner is a handler function that will be called as soon as you marry, and then every time the Zags state is
	 * updated. The partner is provided with the whole Zags state object.
	 */
	export type Partner<$State extends Zags.BaseState> = (
		/**
		 * Zags state.
		 */
		value: $State,

		/**
		 * Indicates whether the partner call is due to state update.
		 *
		 * @true if the partner is called with an update.
		 * @false if the partner is called upon subscription.
		 */
		is_update: boolean,
	) => void

	/**
	 * Marry to get state updates provided to the partner as soon as they arrive. Returns the divorce function that
	 * can be used to unsubscribe from state updates.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 *
	 * zags.marry(({ git }, is_update) => {
	 * 	if (!is_update) return // Only do the thing if it is an update
	 * 	console.log("Your new branch name is", git.branch))
	 * })
	 * ```
	 *
	 * @returns divorce function to unsubscribe from state updates.
	 */
	export type Marry<$State extends Zags.BaseState> = (
		/**
		 * Partner to be called when state updates. Also called when you marry.
		 */
		partner: Zags.Partner<$State>,
	) => () => void

	/**
	 * Divorce with provided partner to prevent it from receiving state updates. Alternatively, you can unsubscribe
	 * by calling the function returned by `zags.marry` or `zags.cheat`.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 *
	 * const partner = ({ git }, is_update) => {
	 * 	if (!is_update) return // Only do the thing if it is an update
	 * 	console.log("Your new branch name is", git.branch))
	 * }
	 *
	 * zags.marry(partner)
	 * zags.divorce(partner)
	 *
	 * zags.update("git.branch", "margarita") // **nothing here**
	 * ```
	 *
	 * @returns divorce function to unsubscribe from state updates.
	 */
	export type Divorce<$State extends Zags.BaseState> = (
		/**
		 * Partner to stop providing updates to.
		 */
		partner: Zags.Partner<$State>,
	) => void

	/**
	 * Cheat with provided partner to get state updates as soon as they arrive. Unlike when you marry, with cheating you
	 * only get the state update under the path you provide. The partner is not called if the state changed, but the
	 * changes did not affect the state under the provided path.
	 *
	 * @since cheating on your loved ones is generally considered a bad idea, we do not recommend cheating.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 *
	 * zags.cheat("git.branch", branch => console.log("Your branch name is", branch))
	 * // "Your branch name is dev"
	 * ```
	 *
	 * @returns drop_affair function to unsubscribe from state updates.
	 */
	export type Cheat<$State extends Zags.BaseState> = <$DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
		/**
		 * Dot-separated path to the entity to cheat with.
		 */
		path: $DotPath,

		/**
		 * Partner to be called when you cheat. Also called when you cheat for the first time.
		 */
		partner: (value: Zags.Pouch.RecordValueByDotPath<$State, $DotPath>, is_update: boolean) => void,
	) => () => void

	/**
	 * Update Zags state and call all married and related cheating partners. The partners **WILL NOT** be called if the
	 * state did not actually change.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 *
	 * zags.cheat("git.branch", branch => console.log("Your branch name is", branch))
	 * // "Your branch name is dev"
	 *
	 * zags.marry(({ git }, is_update) => {
	 * 	if (!is_update) return // Only do the thing if it is an update
	 * 	console.log("Your new branch name is", git.branch))
	 * })
	 * // *nothing here*
	 *
	 * zags.update("git.branch", _ => "margarita")
	 * // "Your branch name is margarita"
	 * // "Your new branch name is margarita"
	 * ```
	 */
	export type Update<$State extends Zags.BaseState> = <$DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
		/**
		 * Dot-separated path to the entity to update.
		 */
		path: $DotPath,

		/**
		 * A callback that is provided with the current value under given path. Whatever is returned, becomes the new value
		 * under given path.
		 *
		 * @returns the value to be put in the state.
		 */
		value_creator: (
			/**
			 * The value currently residing under the given path.
			 */
			prev_value: Zags.Pouch.RecordValueByDotPath<$State, $DotPath>,
		) => Zags.Pouch.RecordValueByDotPath<$State, $DotPath>,
	) => void

	/**
	 * Update the whole Zags state and call all married and all cheating partners. The partners **WILL NOT** be called
	 * if the state did not actually change.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 *
	 * zags.cheat("git.branch", branch => console.log("Your branch name is", branch))
	 * // "Your branch name is dev"
	 *
	 * zags.marry(({ git }, is_update) => {
	 * 	if (!is_update) return // Only do the thing if it is an update
	 * 	console.log("Your new branch name is", git.branch))
	 * })
	 * // *nothing here*
	 *
	 * zags.transform(_ => ({ git: { branch: "margarita" } }))
	 * // "Your branch name is margarita"
	 * // "Your new branch name is margarita"
	 * ```
	 */
	export type Transform<$State extends Zags.BaseState> = (
		/**
		 * A callback that is provided with the current state. Whatever is returned, becomes the new state.
		 *
		 * @returns the new state.
		 */
		value_creator: (
			/**
			 * The current state.
			 */
			prev_state: $State,
		) => $State,
	) => void

	/**
	 * Get the value currently stored under given path.
	 *
	 * @example
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ git: { branch: "dev" } })
	 * const branch = zags.select("git.branch")
	 *
	 * console.log(branch) // "dev"
	 * ```
	 *
	 * @returns value residing under given path.
	 */
	export type Select<$State extends Zags.BaseState> = <$DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
		/**
		 * Dot-separated path to the value.
		 */
		path: $DotPath,
	) => Zags.Pouch.RecordValueByDotPath<$State, $DotPath>

	/**
	 * Returns the whole ZAGS state. Beware - making changes the returned value will affect the state but not call
	 * partners.
	 */
	export type Unwrap<$State extends Zags.BaseState> = () => $State

	/**
	 * Zags instance.
	 */
	export type Instance<$State extends Zags.BaseState> = {
		/** @see {@link Zags.Cheat} */
		cheat: Zags.Cheat<$State>
		/** @see {@link Zags.Divorce} */
		divorce: Zags.Divorce<$State>
		/** @see {@link Zags.Marry} */
		marry: Zags.Marry<$State>
		/** @see {@link Zags.Select} */
		select: Zags.Select<$State>
		/** @see {@link Zags.Transform} */
		transform: Zags.Transform<$State>
		/** @see {@link Zags.Unwrap} */
		unwrap: Zags.Unwrap<$State>
		/** @see {@link Zags.Update} */
		update: Zags.Update<$State>
	}

	/**
	 * # @ordo-pink/zags
	 *
	 * [![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
	 *
	 * A full-featured implementation of [zigzag](https://en.wikipedia.org/wiki/Zigzag) written without Zig. It is also
	 * a minimalistic state manager, but it is not that important.
	 *
	 * ## Quick Start
	 *
	 * ```typescript
	 * import { create_zags } from "@ordo-pink/zags"
	 *
	 * const zags = create_zags({ counter: 0 })
	 * const partner = console.log
	 *
	 * zags.marry(partner) // { counter: 0 }, false
	 *
	 * zags.update("counter", (i) => i + 1) // { counter: 1 }, true
	 * zags.update("counter", (i) => i + 1) // { counter: 2 }, true
	 * zags.update("counter", (i) => i + 1) // { counter: 3 }, true
	 * zags.update("counter", (i) => i + 1) // { counter: 4 }, true
	 *
	 * zags.divorce(partner)
	 *
	 * zags.update("counter", (i) => i + 1)
	 * zags.update("counter", (i) => i + 1)
	 *
	 * const divorce = zags.marry(partner) // { counter: 6 }, false
	 * divorce()
	 *
	 * zags.update("counter", (i) => i + 1)
	 *```
	 * @module
	 */
	export type Module = <$State extends Zags.BaseState>(
		/**
		 * Initial state of Zags.
		 */
		state: $State,

		/**
		 * Optional predefined array of partners.
		 */
		partners?: Zags.Partner<$State>[],
	) => Zags.Instance<$State>

	/**
	 * A bag with useful tools.
	 * @namespace
	 */
	export namespace Pouch {
		/**
		 * Reduce a nested Record to a union of all possible dot-separated keys of that Record.
		 *
		 * @see https://gist.github.com/j1mmie/03e1dfc7ca14296604843235ad32082a
		 * @example
		 * ```typescript
		 * type Keys = RecordToDotPaths<{ hello: { world: true }}> // "hello" | "hello.world"
		 * ```
		 *
		 */
		export type RecordToDotPaths<$Record extends Zags.BaseState> = Zags.Pouch.RecordValues<{
			[_Key in keyof $Record]: $Record[_Key] extends Zags.BaseState
				? `${string & _Key}.${string & Zags.Pouch.RecordToDotPaths<$Record[_Key]>}` | _Key
				: _Key
		}>

		/**
		 * Reduce a Record to a union of its values.
		 *
		 * @example
		 * ```typescript
		 * type Values = RecordValues<{ a: string, b: number }> // string | number
		 * ```
		 */
		export type RecordValues<$Record extends Zags.BaseState> = $Record extends { [_Key in keyof $Record]: infer Type }
			? Type
			: never

		/**
		 * Extract record value type under given dot path (e.g. "key.sub_key.sub_sub_key").
		 *
		 * @example
		 * ```typescript
		 * type Value = RecordValueByDotPath<{ parent: { child: "Hello, World!" } }, "parent.child"> // "Hello, World!"
		 * ```
		 */
		export type RecordValueByDotPath<
			$Record extends Zags.BaseState,
			$DotPath extends Zags.Pouch.RecordToDotPaths<$Record>,
		> = $DotPath extends `${infer _Parent}.${infer _Children}`
			? $Record[_Parent] extends Zags.BaseState
				? _Children extends Zags.Pouch.RecordToDotPaths<$Record[_Parent]>
					? RecordValueByDotPath<$Record[_Parent], _Children>
					: never
				: never
			: $DotPath extends keyof $Record
				? $Record[$DotPath]
				: never
	}
}
