/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/**
 * Expected Zags state. Must be a record.
 */
export type BaseState = Record<string, unknown>

/**
 * Partner is a handler function that will be called as soon as you marry, and then every time the Zags state is
 * updated. The partner is provided with the whole Zags state object.
 */
export type Partner<$State extends BaseState> = (
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
export type Marry<$State extends BaseState> = (
	/**
	 * Partner to be called when state updates. Also called when you marry.
	 */
	partner: Partner<$State>,
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
export type Divorce<$State extends BaseState> = (
	/**
	 * Partner to stop providing updates to.
	 */
	partner: Partner<$State>,
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
export type Cheat<$State extends BaseState> = <const $DotPath extends RecordToDotPaths<$State>>(
	/**
	 * Dot-separated path to the entity to cheat with.
	 */
	path: $DotPath,

	/**
	 * Partner to be called when you cheat. Also called when you cheat for the first time.
	 */
	partner: (value: RecordValueByDotPath<$State, $DotPath>, is_update: boolean) => void,
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
export type Update<$State extends BaseState> = <$DotPath extends RecordToDotPaths<$State>>(
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
		prev_value: RecordValueByDotPath<$State, $DotPath>,
	) => RecordValueByDotPath<$State, $DotPath>,
) => void

/**
 * Update Zags state in multiple places with only one partners call after all changes are applied. The partners
 * **WILL NOT** be called if the state did not actually change.
 *
 * NOTE: The most deeply nested updates happen last.
 *
 * @example
 * ```typescript
 * import { create_zags } from "@ordo-pink/zags"
 *
 * const zags = create_zags({ git: { branch: "dev" }, db: { name: "fs" } })
 *
 * zags.marry(({ git, db }, is_update) => {
 * 	if (!is_update) return // Only do the thing if it is an update
 * 	console.log("Branch:", git.branch, ", db:", db.name))
 * })
 *
 * zags.each({
 * 	"git": _ => ({ branch: "prod" }),
 * 	"git.branch": _ => "margarita", // Deeper updates take precedence over shallow ones
 * 	"db.name": _ => "s3"
 * })
 * // "Branch: margarita, db: s3"
 * ```
 */
export type Each<$State extends BaseState> = (
	/**
	 * @key dot-separated path to the entity to update.
	 * @value callback that is provided with the current value under given path. Whatever is returned, becomes
	 * 				the new value under given path.
	 */
	increment: {
		[_Key in RecordToDotPaths<$State>]?: (prev_value: RecordValueByDotPath<$State, _Key>) => void
	},
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
export type Replace<$State extends BaseState> = (
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
export type Select<$State extends BaseState> = <$DotPath extends RecordToDotPaths<$State>>(
	/**
	 * Dot-separated path to the value.
	 */
	path: $DotPath,
) => RecordValueByDotPath<$State, $DotPath>

/**
 * Returns the whole ZAGS state. Beware - making changes the returned value will affect the state but not call
 * partners.
 */
export type Unwrap<$State extends BaseState> = () => $State

export type Concat<$State extends BaseState> = <_NewState extends BaseState>(
	o: Instance<_NewState> | ReadableInstance<_NewState>,
) => Instance<$State & _NewState>

export type Kill = () => void

export type OnKill = (handler: KillHandler) => void

export type KillHandler = () => void

/**
 * Zags instance.
 */
export type Instance<$State extends BaseState> = {
	cheat: Cheat<$State>
	divorce: Divorce<$State>
	marry: Marry<$State>
	select: Select<$State>
	concat: Concat<$State>
	replace: Replace<$State>
	unwrap: Unwrap<$State>
	update: Update<$State>
	each: Each<$State>
	kill: Kill
	on_kill: OnKill
	to_readable: () => ReadableInstance<$State>
}

/**
 * Zags instance.
 */
export type ReadableInstance<$State extends BaseState> = {
	cheat: Cheat<$State>
	divorce: Divorce<$State>
	marry: Marry<$State>
	select: Select<$State>
	unwrap: Unwrap<$State>
	on_kill: OnKill
	kill: Kill
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
 * const divorce = zags.marry(partner) // { counter: 0 }, false
 *
 * zags.update("counter", (i) => i + 1) // { counter: 1 }, true
 * zags.update("counter", (i) => i + 1) // { counter: 2 }, true
 * zags.update("counter", (i) => i + 1) // { counter: 3 }, true
 * zags.update("counter", (i) => i + 1) // { counter: 4 }, true
 *
 * divorce()
 *
 * zags.update("counter", (i) => i + 1)
 *
 * console.log(zags.select("counter")) // 5
 *```
 * @module
 */
export type Module = <$State extends BaseState>(
	/**
	 * Initial state of
	 */
	state: $State,

	/**
	 * Optional predefined array of partners.
	 */
	partners?: Partner<$State>[],
) => Instance<$State>

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
export type RecordToDotPaths<$Record extends BaseState> = RecordValues<{
	[_Key in keyof $Record]: $Record[_Key] extends BaseState
		? `${string & _Key}.${string & RecordToDotPaths<$Record[_Key]>}` | _Key
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
export type RecordValues<$Record extends BaseState> = $Record extends { [_Key in keyof $Record]: infer Type }
	? Type extends NonNullable<unknown>
		? Type
		: never
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
	$Record extends BaseState,
	$DotPath extends RecordToDotPaths<$Record>,
> = $DotPath extends `${infer _Parent}.${infer _Children}`
	? $Record[_Parent] extends BaseState
		? _Children extends RecordToDotPaths<$Record[_Parent]>
			? RecordValueByDotPath<$Record[_Parent], _Children>
			: never
		: never
	: $DotPath extends keyof $Record
		? $Record[$DotPath]
		: never
