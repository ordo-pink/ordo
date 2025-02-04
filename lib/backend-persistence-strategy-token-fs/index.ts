/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Oath, ops0 } from "@ordo-pink/oath"
import { noop, override } from "@ordo-pink/tau"
import { RRR } from "@ordo-pink/core"
import { type SUB } from "@ordo-pink/wjwt"

export type TPersistenceStrategyTokenFSStatic = {
	Of: (path: string) => OrdoBackend.Token.PersistenceStrategy
}

export const PersistenceStrategyTokenFS: TPersistenceStrategyTokenFSStatic = {
	Of: (db_path: string) => {
		const get_tokens0 = Oath.FromPromise(() => Bun.file(db_path).json()).fix(() => ({}) as Record<SUB, OrdoBackend.Token.Dict>)

		const write_tokens0 = (tokens: Record<string, OrdoBackend.Token.Dict>) =>
			Oath.Try(() => JSON.stringify(tokens, null, 2))
				.pipe(ops0.chain(data => Oath.FromPromise(() => Bun.write(db_path, data))))
				.pipe(ops0.map(noop))
				.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message, e.name, e.cause, e.stack)))

		return {
			get_token: (sub, jti) => get_tokens0.pipe(ops0.map(storage => storage[sub]?.[jti])),

			get_token_dict: sub => get_tokens0.pipe(ops0.map(storage => storage[sub])),

			remove_token: (sub, jti) =>
				get_tokens0
					.pipe(
						ops0.chain(storage =>
							Oath.FromNullable(storage[sub])
								.pipe(ops0.map(() => storage))
								.pipe(ops0.rejected_map(() => RRR.codes.enoent("Token not found", sub))),
						),
					)
					.pipe(
						ops0.map(storage => ({
							...storage,
							[sub]: override<OrdoBackend.Token.Dict>({ [jti]: undefined })(storage[sub]),
						})),
					)
					.pipe(ops0.chain(write_tokens0)),

			remove_token_dict: sub =>
				get_tokens0
					.pipe(
						ops0.chain(storage =>
							Oath.FromNullable(storage[sub])
								.pipe(ops0.map(() => storage))
								.pipe(ops0.rejected_map(() => RRR.codes.enoent("Token not found", sub))),
						),
					)
					.pipe(ops0.map(override({ [sub]: undefined })))
					.pipe(ops0.chain(write_tokens0)),

			set_token: (sub, jti, token) =>
				get_tokens0
					.pipe(
						ops0.chain(storage =>
							Oath.FromNullable(storage[sub])
								.fix(() => {})
								.pipe(ops0.map(() => storage)),
						),
					)
					.pipe(ops0.map(storage => ({ ...storage, [sub]: { ...(storage[sub] ?? {}), [jti]: token } })))
					.pipe(ops0.chain(write_tokens0)),

			set_token_dict: (sub, record) =>
				get_tokens0
					.pipe(
						ops0.chain(storage =>
							Oath.FromNullable(storage[sub])
								.fix(() => {})
								.pipe(ops0.map(() => storage)),
						),
					)
					.pipe(ops0.map(override({ [sub]: record })))
					.pipe(ops0.chain(write_tokens0)),
		}
	},
}
