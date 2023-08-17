// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { JTI, TokenRecord, TokenRepository } from "@ordo-pink/backend-token-service/mod.ts"
import type {} from "#ramda"
import { Unary, Curry, Binary, Method } from "@ordo-pink/tau/mod.ts"

// --- Public ---

// deno-lint-ignore no-explicit-any
export type Params = { db: any; key: string }
export type Fn = Unary<Params, TokenRepository>

// --- Internal ---

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
