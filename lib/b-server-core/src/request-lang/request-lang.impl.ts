import { LOCALE, LOCALE_READABLE_NAME } from "@ordo-pink/oss-i18n"
import { keys_of } from "@ordo-pink/_tau"
import { result } from "@ordo-pink/oss-result"

import type * as T from "./request-lang.types"

export const set: T.Set = ({ request }) =>
	result
		.from_nullable(request.headers.get("Accept-Language"))
		.pipe(split_by(","))
		.pipe(head)
		.pipe(split_by("-"))
		.pipe(head)
		.pipe(is_valid_iso_639_1_locale)
		.cata({
			err: () => ({ request_language: LOCALE.ENGLISH }),
			ok: request_language => ({ request_language }),
		})

// --- Internal ---

const ls = keys_of(LOCALE_READABLE_NAME)

const split_by = (separator: string) => result.ops.map((str: string) => str.split(separator))

const head = result.ops.chain(([first]: string[]) => result.from_nullable(first))

const includes_r = (xs: string[], x: string) => result.if(xs.includes(x))

const is_valid_iso_639_1_locale = result.ops.chain((l: string) => includes_r(ls, l).pipe(result.ops.map(() => l as LOCALE)))
