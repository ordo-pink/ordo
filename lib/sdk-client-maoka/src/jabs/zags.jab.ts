/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const marry$: OrdoClientMaoka.Jabs.Marry$ =
	zags =>
	({ use, refresh$ }) => {
		let value: any
		const divorce = zags.marry(state => {
			value = state
			refresh$()
		})

		use(maoka_dom.jabs.onunmount(divorce))

		return () => value
	}

export const cheat$: OrdoClientMaoka.Jabs.Cheat$ =
	(zags, dot_path) =>
	({ use, refresh$ }) => {
		let value: any

		const divorce = zags.cheat(dot_path, state => {
			value = state
			refresh$()
		})

		use(maoka_dom.jabs.onunmount(divorce))

		return () => value
	}

declare global {
	namespace OrdoClientMaoka.Jabs {
		type Cheat$ = <$State extends Zags.BaseState, const $DotPath extends Zags.RecordToDotPaths<$State>>(
			zags: Zags.Instance<$State> | Zags.ReadableInstance<$State>,
			dot_path: $DotPath,
		) => Maoka.Jab<() => Zags.RecordValueByDotPath<$State, $DotPath>>

		type Marry$ = <$State extends Zags.BaseState>(
			zags: Zags.Instance<$State> | Zags.ReadableInstance<$State>,
		) => Maoka.Jab<() => $State>
	}
}
