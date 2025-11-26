/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const marry$: <$State extends Zags.BaseState>(
	zags: Zags.Instance<$State> | Zags.ReadableInstance<$State>,
) => Maoka.Jab<() => $State> =
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

export const cheat$: <
	$State extends Zags.BaseState,
	const $DotPath extends Zags.RecordToDotPaths<$State>,
	$Result = Zags.RecordValueByDotPath<$State, $DotPath>,
>(
	zags: Zags.Instance<$State> | Zags.ReadableInstance<$State>,
	dot_path: $DotPath,
	f?: (state: Zags.RecordValueByDotPath<$State, $DotPath>) => $Result,
) => Maoka.Jab<() => $Result> =
	(zags, dot_path, handler = x => x as any) =>
	({ use, refresh$ }) => {
		let value: any

		const divorce = zags.cheat(dot_path, state => {
			value = handler(state)
			refresh$()
		})

		use(maoka_dom.jabs.onunmount(divorce))

		return () => value
	}
