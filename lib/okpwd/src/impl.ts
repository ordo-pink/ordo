import { Either } from "#lib/either/mod.ts"
import type { OkpwdFn, OkpwdOptions } from "./types.ts"

export const okpwd: OkpwdFn = options => password => {
	const o = (options ? options : {}) as Required<OkpwdOptions>

	if (o.min == null) o.min = 8
	if (o.max == null) o.max = 50
	if (o.skipCheckForAlphaCharacters == null)
		o.skipCheckForAlphaCharacters = false
	if (o.skipCheckForNumbers == null) o.skipCheckForNumbers = false
	if (o.skipCheckForSpecialCharacters == null)
		o.skipCheckForSpecialCharacters = false

	return Either.fromNullable(password)
		.leftMap(() => "No password provided.")
		.chain(password =>
			Either.fromBooleanLazy(
				() => password.length >= o.min,
				() => password,
				() => `Password must be at least ${o.min} characters long.`
			)
		)
		.chain(password =>
			Either.fromBooleanLazy(
				() => password.length <= o.max,
				() => password,
				() => `Password must be under ${o.max} characters long.`
			)
		)
		.chain(password =>
			Either.fromBooleanLazy(
				() => (o.skipCheckForAlphaCharacters ? true : /\p{L}/u.test(password)),
				() => password,
				() => `Password must contain contain letters.`
			)
		)
		.chain(password =>
			Either.fromBooleanLazy(
				() => (o.skipCheckForNumbers ? true : /\d/u.test(password)),
				() => password,
				() => `Password must contain contain numbers.`
			)
		)
		.chain(password =>
			Either.fromBooleanLazy(
				() =>
					o.skipCheckForSpecialCharacters
						? true
						: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
				() => password,
				() =>
					`Password must contain contain special characters ([\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).`
			)
		)
		.fold(
			x => x,
			() => null
		)
}
