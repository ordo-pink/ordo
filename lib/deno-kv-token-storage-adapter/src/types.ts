// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { T as TS } from "#lib/token-service/mod.ts"
import type { T as TAU } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

// deno-lint-ignore no-explicit-any
export type Params = { db: any; key: string }
export type Fn = TAU.Unary<Params, TS.Adapter>

// INTERNAL ---------------------------------------------------------------------------------------

export type _DropKeyFn = TAU.Curry<TAU.Binary<TS.JTI, TS.TokenDict, TS.TokenDict>>
export type _DropKeyReducerFn = TAU.Binary<
	TS.JTI,
	TS.TokenDict,
	TAU.Binary<TS.TokenDict, keyof TS.TokenDict, TS.TokenDict>
>

export type _GetTokenFn = TAU.Method<Params, TS.Adapter, "getToken">
export type _GetTokenDictFn = TAU.Method<Params, TS.Adapter, "getTokenDict">
export type _SetTokenFn = TAU.Method<Params, TS.Adapter, "setToken">
export type _SetTokenDictFn = TAU.Method<Params, TS.Adapter, "setTokenDict">
export type _RemoveTokenFn = TAU.Method<Params, TS.Adapter, "removeToken">
export type _RemoveTokenDictFn = TAU.Method<Params, TS.Adapter, "removeTokenDict">
