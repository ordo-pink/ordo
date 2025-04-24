/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TMaokaJab } from "@ordo-pink/maoka"
import type { Zags } from "@ordo-pink/zags"

/**
 * MaokaZAGS instance.
 */
export type TMaokaZags<$TState extends Record<string, unknown>> = {
	readonly zags: Zags.Instance<$TState>

	/**
	 * A Jab that subscribes to a value extracted with a selector function, and refreshes the Maoka
	 * component if the value changes. It automatically divorces the ZAGS state when the component
	 * unmounts. The value is internally cached to avoid redundant refreshes.
	 *
	 * @param selector function that reduces state to desired value.
	 */
	select_jab$: <_TKey extends Zags.Pouch.RecordToDotPaths<$TState>>(
		path: _TKey,
	) => TMaokaJab<() => Zags.Pouch.RecordValueByDotPath<$TState, _TKey>>
}
