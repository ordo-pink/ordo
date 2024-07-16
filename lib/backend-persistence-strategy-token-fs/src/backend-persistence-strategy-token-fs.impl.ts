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

import { type TokenPersistenceStrategy, type TokenRecord } from "@ordo-pink/backend-service-token"
import { create_parent_if_not_exists0, file_exists0, read_file0, write_file0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { type UserID } from "@ordo-pink/data"

let storage = {} as Record<UserID, TokenRecord>

export const TokenPersistenceStrategyFS = {
	of: async (path: string): Promise<TokenPersistenceStrategy> => {
		await file_exists0(path)
			.chain(exists =>
				exists
					? read_file0(path, "utf-8")
							.map(text => JSON.parse(text as string))
							.fix(() => ({}))
					: create_parent_if_not_exists0(path).chain(() =>
							write_file0(path, "{}", "utf-8").map(() => ({})),
						),
			)
			.map(strg => {
				storage = strg
			})
			.orElse(console.log)

		return {
			getToken: (sub, jti) =>
				Oath.fromNullable(storage[sub])
					.chain(record => Oath.fromNullable(record[jti]))
					.fix(() => null),
			getTokenRecord: sub => Oath.fromNullable(storage[sub]).fix(() => null),
			removeToken: (sub, jti) =>
				Oath.fromNullable(storage[sub])
					.chain(record => Oath.fromNullable(record[jti]))
					.map(() => delete storage[sub][jti])
					.chain(() => write_file0(path, JSON.stringify(storage), "utf-8"))
					.fix(() => null)
					.map(() => "OK"),
			removeTokenRecord: sub =>
				Oath.fromNullable(storage[sub])
					.fix(() => null)
					.map(() => delete storage[sub])
					.chain(() => write_file0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
			setToken: (sub, jti, token) =>
				Oath.fromNullable(storage[sub])
					.fix(() => void (storage[sub] = {}))
					.map(() => void (storage[sub][jti] = token))
					.chain(() => write_file0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
			setTokenRecord: (sub, record) =>
				Oath.empty()
					.map(() => void (storage[sub] = record))
					.chain(() => write_file0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
		}
	},
}
