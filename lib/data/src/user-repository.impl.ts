import { map } from "rxjs"

import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import type * as Types from "./user-repository.types"
import { RRR } from "./metadata.errors"
import { TRemoteCurrentUserRepositoryStatic } from "./user-repository.types"

const CURRENT_USER_REPOSITORY = "CurrentUserRepository"
const KNOWN_USER_REPOSITORY = "KnownUserRepository"

const eagain_current_user = RRR.codes.eagain(CURRENT_USER_REPOSITORY)
// const einval_current_user = RRR.codes.einval(CURRENT_USER_REPOSITORY)

// const eagain_known_user = RRR.codes.eagain(KNOWN_USER_REPOSITORY)
const einval_known_user = RRR.codes.einval(KNOWN_USER_REPOSITORY)

export const CurrentUserRepository: Types.TCurrentUserRepositoryStatic = {
	of: $ => ({
		get: () => Result.FromOption($.getValue(), () => eagain_current_user()),
		put: user => Result.Try(() => $.next(O.Some(user))), // TODO:
		get version$() {
			let i = 0
			return $.pipe(map(() => i++))
		},
	}),
}

export const KnownUserRepository: Types.TKnownUserRepositoryStatic = {
	of: $ => ({
		get: () => Oath.Resolve($.getValue()),
		put: () => Oath.Reject(einval_known_user("NOT IMPLEMENTED")), // TODO:
		get version$() {
			let i = 0
			return $.pipe(map(() => i++))
		},
	}),
}

export const RemoteCurrentUserRepository: TRemoteCurrentUserRepositoryStatic = {
	of: (id_host, fetch) => ({
		get: token =>
			Oath.Try(() => fetch(`${id_host}/account`, req_init(token)))
				.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
				.pipe(Oath.ops.rejected_map(error => eio(error))),
		put: () => Oath.Reject(eio("TODO: UNIMPLEMENTED")),
	}),
}

const eio = RRR.codes.eio("RemoteCurrentUserRepository")
const req_init = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })
