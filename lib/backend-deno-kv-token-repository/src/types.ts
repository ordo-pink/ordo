// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { JTI, TokenRecord, TokenRepository } from "#lib/backend-token-service/mod.ts"
import type {} from "#ramda"
import { Unary, Curry, Binary, Method } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
export type Params = { db: any; key: string }
export type Fn = Unary<Params, TokenRepository>

// INTERNAL ---------------------------------------------------------------------------------------

export type _DropKeyFn = Curry<Binary<JTI, TokenRecord, TokenRecord>>
export type _DropKeyReducerFn = Binary<
	JTI,
	TokenRecord,
	Binary<TokenRecord, keyof TokenRecord, TokenRecord>
>

export type _GetTokenFn = Method<Params, TokenRepository, "getToken">
export type _GetTokenRecordFn = Method<Params, TokenRepository, "getTokenRecord">
export type _SetTokenFn = Method<Params, TokenRepository, "setToken">
export type _SetTokenRecordFn = Method<Params, TokenRepository, "setTokenRecord">
export type _RemoveTokenFn = Method<Params, TokenRepository, "removeToken">
export type _RemoveTokenRecordFn = Method<Params, TokenRepository, "removeTokenRecord">
