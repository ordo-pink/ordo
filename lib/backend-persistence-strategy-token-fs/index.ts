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

import { create_parent_if_not_exists0, read_file0, write_file0 } from "@ordo-pink/fs"
import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { type TPersistenceStrategyToken } from "@ordo-pink/backend-service-token"
import { type TTokenRecord } from "@ordo-pink/backend-service-token"
import { override } from "@ordo-pink/tau"

export type TPersistenceStrategyTokenFSStatic = {
	of: (path: string) => TPersistenceStrategyToken
}

export const PersistenceStrategyTokenFS: TPersistenceStrategyTokenFSStatic = {
	of: (path: string) => ({
		get_token: (sub, jti) =>
			get_tokens0(path)
				.pipe(Oath.ops.map(storage => storage[sub]?.[jti]))
				.pipe(Oath.ops.map(token => O.FromNullable(token))),

		get_tokens: sub =>
			get_tokens0(path)
				.pipe(Oath.ops.map(storage => storage[sub]))
				.pipe(Oath.ops.map(token => O.FromNullable(token))),

		remove_token: (sub, jti) =>
			get_tokens0(path)
				.pipe(
					Oath.ops.chain(storage =>
						Oath.FromNullable(storage[sub])
							.pipe(Oath.ops.map(() => storage))
							.pipe(Oath.ops.rejected_map(() => enoent(`remove_token -> sub: ${sub}`))),
					),
				)
				.pipe(
					Oath.ops.map(storage => ({
						...storage,
						[sub]: override<TTokenRecord>({ [jti]: undefined })(storage[sub]),
					})),
				)
				.pipe(Oath.ops.chain(write_tokens0(path))),

		remove_tokens: sub =>
			get_tokens0(path)
				.pipe(
					Oath.ops.chain(storage =>
						Oath.FromNullable(storage[sub])
							.pipe(Oath.ops.map(() => storage))
							.pipe(Oath.ops.rejected_map(() => enoent(`remove_tokens -> sub: ${sub}`))),
					),
				)
				.pipe(Oath.ops.map(override({ [sub]: undefined })))
				.pipe(Oath.ops.chain(write_tokens0(path))),

		set_token: (sub, jti, token) =>
			get_tokens0(path)
				.pipe(
					Oath.ops.chain(storage =>
						Oath.FromNullable(storage[sub])
							.fix(() => {})
							.pipe(Oath.ops.map(() => storage))
							.pipe(Oath.ops.rejected_map(() => enoent(`set_token -> sub: ${sub}`))),
					),
				)
				.pipe(
					Oath.ops.map(storage => ({
						...storage,
						[sub]: { ...(storage[sub] ?? {}), [jti]: token },
					})),
				)
				.pipe(Oath.ops.chain(write_tokens0(path))),

		set_tokens: (sub, record) =>
			get_tokens0(path)
				.pipe(
					Oath.ops.chain(storage =>
						Oath.FromNullable(storage[sub])
							.fix(() => {})
							.pipe(Oath.ops.map(() => storage))
							.pipe(Oath.ops.rejected_map(() => enoent(`set_tokens -> sub: ${sub}`))),
					),
				)
				.pipe(Oath.ops.map(override({ [sub]: record })))
				.pipe(Oath.ops.chain(write_tokens0(path))),
	}),
}

// --- Internal ---

const LOCATION = "PersistenceStrategyTokenFS"

const eio = RRR.codes.eio(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

const get_tokens0 = (path: string) =>
	read_file0(path, "utf-8")
		.pipe(Oath.ops.map(text => JSON.parse(text as string) as Record<string, TTokenRecord>))
		.fix(() => ({}) as Record<string, TTokenRecord>)

const write_tokens0 = (path: string) => (tokens: Record<string, TTokenRecord>) =>
	create_parent_if_not_exists0(path)
		.pipe(Oath.ops.chain(() => Oath.Try(() => JSON.stringify(tokens, null, 2))))
		.pipe(Oath.ops.chain(data => write_file0(path, data, "utf-8")))
		.pipe(Oath.ops.rejected_map(e => eio(`write_tokens -> error: ${e.message}`)))
