// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import { Oath } from "./impl.ts"

export const oathify =
	<$TError = Error, $TArgs extends any[] = any[], $TResult extends Promise<any> = Promise<any>>(
		f: (...args: $TArgs) => $TResult,
	) =>
	(...args: $TArgs): Oath<Awaited<$TResult>, $TError> =>
		Oath.FromPromise(() => f(...args))
