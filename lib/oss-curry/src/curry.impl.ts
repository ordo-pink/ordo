/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Curry } from "./curry.types"

export const curry = <$Args extends any[], $Result>(fn: (...args: $Args) => $Result): Curry<$Args, $Result> =>
	function curried(...args: $Args): any {
		if (args.length >= fn.length) return fn(...args)
		else return (...args2: any[]) => curried(...([...args, ...args2] as $Args))
	} as any
