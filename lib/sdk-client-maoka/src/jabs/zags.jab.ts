/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "@ordo-pink/oss-maoka"
import * as maoka from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"

export namespace zags_jabs {
	export const marry$ =
		<$State extends Zags.BaseState>(zags: Zags.Instance<$State>): Maoka.Jab<() => $State> =>
		({ use }) => {
			let value: $State
			const divorce = zags.marry(state => {
				value = state
				use(maoka.jab_refresh$)
			})

			use(maoka.jab_onunmount(divorce))

			return () => value
		}

	export const cheat$ =
		<$State extends Zags.BaseState, const $DotPath extends Zags.Pouch.RecordToDotPaths<$State>>(
			zags: Zags.Instance<$State>,
			dot_path: $DotPath,
		): Maoka.Jab<() => Zags.Pouch.RecordValueByDotPath<$State, $DotPath>> =>
		({ use }) => {
			let value: Zags.Pouch.RecordValueByDotPath<$State, $DotPath>

			const divorce = zags.cheat(dot_path, state => {
				value = state
				use(maoka.jab_refresh$)
			})

			use(maoka.jab_onunmount(divorce))

			return () => value
		}
}
