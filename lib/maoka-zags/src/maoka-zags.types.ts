import type { TDotPath, TFromDotPath, TZags } from "@ordo-pink/zags"
import type { TMaokaJab } from "@ordo-pink/maoka"

/**
 * MaokaZAGS instance.
 */
export type TMaokaZags<$TState extends Record<string, unknown>> = {
	readonly zags: TZags<$TState>

	/**
	 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
	 * component if the value changes. It automatically divorces the ZAGS state when the component
	 * unmounts. The value is internally cached to avoid redundant refreshes.
	 *
	 * @param selector function that reduces state to desired value.
	 */
	select_jab$: <_TKey extends TDotPath<$TState>>(path: _TKey) => TMaokaJab<() => TFromDotPath<$TState, _TKey>>
}
