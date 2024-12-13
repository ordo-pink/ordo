import type { TMaokaJab } from "@ordo-pink/maoka"

/**
 * MaokaZAGS instance.
 */
export type TMaokaZags<$TState extends Record<string, unknown>> = {
	/**
	 * Update ZAGS state with given value.
	 *
	 * @param path path to the value to be set in the state.
	 * @param value value to be assigned under given path.
	 */
	update: <$TKey extends TDotPath<$TState>>(path: $TKey, value: TFromDotPath<$TState, $TKey>) => void

	/**
	 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
	 * component if the value changes. It automatically divorces the ZAGS state when the component
	 * unmounts. The value is internally cached to avoid redundant refreshes.
	 *
	 * @param selector function that reduces state to desired value.
	 */
	select_jab$: <$TResult>(selector: (state: $TState) => $TResult) => TMaokaJab<() => $TResult>
}

/**
 * Extract value type under given dot path (e.g. "key.sub_key.sub_sub_key").
 *
 * @example
 * ```
 * type THelloWorld = TFromDotPath<{ parent: { child: "Hello, World!" } }, "parent.child"> // "Hello, World!"
 * ```
 */
export type TFromDotPath<T extends Record<string, unknown>, K extends TDotPath<T>> = K extends `${infer U}.${infer N}`
	? T[U] extends Record<string, unknown>
		? N extends TDotPath<T[U]>
			? TFromDotPath<T[U], N>
			: never
		: never
	: K extends keyof T
		? T[K]
		: never

/**
 * @see https://gist.github.com/j1mmie/03e1dfc7ca14296604843235ad32082a
 */
export type TDotPath<$TRecord> = TValues<{
	[_TKey in keyof $TRecord]: $TRecord[_TKey] extends Record<string, unknown>
		? `${string & _TKey}.${string & TDotPath<$TRecord[_TKey]>}` | _TKey
		: _TKey
}>

type TValues<T> = T extends { [name in keyof T]: infer Type } ? Type : never
