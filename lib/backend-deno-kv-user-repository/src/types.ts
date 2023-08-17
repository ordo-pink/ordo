// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// deno-lint-ignore-file no-explicit-any

import { UserRepository } from "#lib/backend-user-service/mod.ts"

export type Config = { path?: string; key?: string }
export type Params = { db: any; idKey: string; emailKey: string }
export type Fn = (params: Params) => UserRepository
