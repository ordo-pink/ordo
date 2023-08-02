// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// deno-lint-ignore-file no-explicit-any

import { UserRepository } from "#lib/backend-user-service/mod.ts"

export type Config = { path?: string; key?: string }
export type Params = { db: any; idKey: string; emailKey: string }
export type Fn = (params: Params) => UserRepository
