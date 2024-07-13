import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import type * as Types from "./user-repository.types"
import { RRR } from "./metadata.errors"
import { map } from "rxjs"

const CURRENT_USER_REPOSITORY = "CurrentUserRepository"
const KNOWN_USER_REPOSITORY = "KnownUserRepository"

const eagain_current_user = RRR.codes.eagain(CURRENT_USER_REPOSITORY)
const einval_current_user = RRR.codes.einval(CURRENT_USER_REPOSITORY)

const eagain_known_user = RRR.codes.eagain(KNOWN_USER_REPOSITORY)
const einval_known_user = RRR.codes.einval(KNOWN_USER_REPOSITORY)

export const CurrentUserRepository: Types.TCurrentUserRepositoryStatic = {
	of: $ => ({
		get: () => Result.FromOption($.getValue(), () => eagain_current_user()),
		put: () => Result.Err(einval_current_user("NOT IMPLEMENTED")), // TODO:
		get sub() {
			let i = 0
			return $.pipe(map(() => ++i))
		},
	}),
}

export const KnownUserRepository: Types.TKnownUserRepositoryStatic = {
	of: $ => ({
		get: () =>
			$.getValue().cata({
				Some: Oath.Resolve,
				None: () => Oath.Reject(eagain_known_user("NOT_IMPLEMENTED")), // TODO:
			}),
		put: () => Oath.Reject(einval_known_user("NOT IMPLEMENTED")), // TODO:
		get sub() {
			let i = 0
			return $.pipe(map(() => ++i))
		},
	}),
}
