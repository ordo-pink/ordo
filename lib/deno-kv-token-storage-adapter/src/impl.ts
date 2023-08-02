// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { TokenRecord } from "#lib/token-service/mod.ts"
import type * as T from "./types.ts"

import { keysOf } from "#lib/tau/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// TODO: Remove any when Deno.Kv starts working again

// PUBLIC -----------------------------------------------------------------------------------------

const adapter: T.Fn = params => ({
	getToken: getToken(params),
	getTokenRecord: getTokenRecord(params),
	removeToken: removeToken(params),
	removeTokenRecord: removeTokenRecord(params),
	setToken: setToken(params),
	setTokenRecord: setTokenRecord(params),
})

export const DenoKVTokenStorageAdapter = {
	of: async (path: string, key = "refresh_tokens") => {
		// deno-lint-ignore no-explicit-any
		const db = await (Deno as any).openKv(path)
		return adapter({ db, key })
	},
}

// INTERNAL ---------------------------------------------------------------------------------------

const dropKeyReducer: T._DropKeyReducerFn = (jti, dict) => (newMap, key) =>
	key === jti ? newMap : { ...newMap, [key]: dict[key] }

const dropKey: T._DropKeyFn = jti => dict =>
	keysOf(dict).reduce(dropKeyReducer(jti, dict), {} as TokenRecord)

const getToken: T._GetTokenFn =
	({ db, key }) =>
	(sub, jti) =>
		adapter({ db, key })
			.getTokenRecord(sub)
			.chain(dict => Oath.fromNullable(dict[jti]))

const getTokenRecord: T._GetTokenRecordFn =
	({ db, key }) =>
	sub =>
		Oath.try(() => db.get([key, sub])).map(dict => dict.value)

const removeToken: T._RemoveTokenFn =
	({ db, key }) =>
	(sub, jti) =>
		adapter({ db, key })
			.getTokenRecord(sub)
			.map(dropKey(jti))
			.chain(dict => adapter({ db, key }).setTokenRecord(sub, dict))

const removeTokenRecord: T._RemoveTokenRecordFn =
	({ db, key }) =>
	sub =>
		Oath.try(() => db.remove([key, sub]))

const setToken: T._SetTokenFn =
	({ db, key }) =>
	(sub, jti, token) =>
		adapter({ db, key })
			.getTokenRecord(sub)
			.fix(() => ({} as TokenRecord))
			.map(dict => ({ ...dict, [jti]: token }))
			.chain(dict => adapter({ db, key }).setTokenRecord(sub, dict))

const setTokenRecord: T._SetTokenRecordFn =
	({ db, key }) =>
	(sub, map) =>
		Oath.try(() => db.set([key, sub], map))
