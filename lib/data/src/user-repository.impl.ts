// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
		get: token => {
			const path: Routes.ID.GetAccount.Path = "/account"

			return Oath.Try(() => fetch(id_host.concat(path), req_init(token)))
				.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
				.pipe(Oath.ops.rejected_map(error => eio(error)))
		},
		put: () => Oath.Reject(eio("TODO: UNIMPLEMENTED")),
	}),
}

const eio = RRR.codes.eio("RemoteCurrentUserRepository")
const req_init = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })
