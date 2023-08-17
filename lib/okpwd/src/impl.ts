// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type * as T from "./types.ts"

import { Either } from "#lib/either/mod.ts"
import { identity } from "#ramda"

export const okpwd: T.Fn = options => password => {
	const o = (options ? options : {}) as Required<T.Options>

	if (o.min == null) o.min = 8
	if (o.max == null) o.max = 50
	if (o.skipCheckForAlphaCharacters == null) o.skipCheckForAlphaCharacters = false
	if (o.skipCheckForNumbers == null) o.skipCheckForNumbers = false
	if (o.skipCheckForSpecialCharacters == null) o.skipCheckForSpecialCharacters = false

	return Either.fromNullable(password)
		.leftMap(() => "No password provided.")
		.chain(password =>
			Either.fromBoolean(
				() => password.length >= o.min,
				() => password,
				() => `Password must be at least ${o.min} characters long.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => password.length <= o.max,
				() => password,
				() => `Password must be under ${o.max} characters long.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => (o.skipCheckForAlphaCharacters ? true : /\p{L}/u.test(password)),
				() => password,
				() => `Password must contain contain letters.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => (o.skipCheckForNumbers ? true : /\d/u.test(password)),
				() => password,
				() => `Password must contain contain numbers.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() =>
					o.skipCheckForSpecialCharacters
						? true
						: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
				() => password,
				() =>
					`Password must contain contain special characters ([\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).`,
			),
		)
		.fold(identity, () => null)
}
