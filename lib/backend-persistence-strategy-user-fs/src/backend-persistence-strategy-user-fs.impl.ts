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

import { read_file0, write_file_rec0 } from "@ordo-pink/fs"
import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { type TPersistenceStrategyUser } from "@ordo-pink/backend-service-user"

export const PersistenceStrategyUserFS = {
	of: (path: string): TPersistenceStrategyUser => ({
		create: user =>
			_get_users0(path)
				.pipe(Oath.ops.chain(_check_user_does_not_exist0("id", user)))
				.pipe(Oath.ops.chain(_check_user_does_not_exist0("email", user)))
				.pipe(Oath.ops.chain(_check_user_does_not_exist0("handle", user)))
				.pipe(Oath.ops.chain(users => _save_users0(path, [...users, user]))),

		exists_by_email: e => _get_users0(path).pipe(Oath.ops.map(_check_exists("email", e))),

		exists_by_id: i => _get_users0(path).pipe(Oath.ops.map(_check_exists("id", i))),

		exists_by_handle: h => _get_users0(path).pipe(Oath.ops.map(_check_exists("handle", h))),

		get_by_email: email =>
			_get_users0(path).pipe(
				Oath.ops.map(users => O.FromNullable(users.find(user => user.email === email))),
			),

		get_by_id: id =>
			_get_users0(path).pipe(
				Oath.ops.map(users => O.FromNullable(users.find(user => user.id === id))),
			),

		get_by_handle: handle =>
			_get_users0(path).pipe(
				Oath.ops.map(users => O.FromNullable(users.find(user => user.handle === handle))),
			),

		update: (id, updated_user) =>
			_get_users0(path)
				.pipe(Oath.ops.chain(_replace_in_user_array0(id, updated_user)))
				.pipe(Oath.ops.chain(users => _save_users0(path, users)))
				.pipe(Oath.ops.map(() => updated_user)),

		get_outdated: current_entity_version =>
			_get_users0(path).pipe(
				Oath.ops.map(users =>
					users.filter(
						user => !user.entity_version || user.entity_version < current_entity_version,
					),
				),
			),

		migrate: () => Oath.Resolve(void 0),
	}),
}

// --- Internal ---

const LOCATION = "PersistenceStrategyUserFS"

const eio = RRR.codes.eio(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

const _check_user_does_not_exist0 =
	(key: "id" | "email" | "handle", user: User.PrivateUser) => (users: User.PrivateUser[]) =>
		Oath.If(!users.some(u => u[key] === user[key]), {
			T: () => users,
			F: () => eexist(`create -> id: ${user.id}`),
		})

const _get_users0 = (path: string) =>
	read_file0(path, "utf-8")
		.fix(() => write_file_rec0(path, "[]", "utf-8").pipe(Oath.ops.map(() => "[]")))
		.pipe(Oath.ops.chain(file => Oath.Try(() => JSON.parse(file as string) as User.PrivateUser[])))
		.pipe(Oath.ops.rejected_map(error => eio(`get_users -> error: ${error.message}`)))

const _save_users0 = (path: string, data: User.PrivateUser[]) =>
	Oath.Try(() => JSON.stringify(data))
		.pipe(Oath.ops.chain(file => write_file_rec0(path, file, "utf-8")))
		.pipe(Oath.ops.rejected_map(error => eio(`save_users -> error: ${error.message}`)))

const _replace_in_user_array0 =
	(id: User.PrivateUser["id"], updated_user: User.PrivateUser) => (users: User.PrivateUser[]) =>
		Oath.FromNullable(
			users.find(user => user.id === id),
			() => enoent(`update -> id: ${id}`),
		).pipe(
			Oath.ops.map(existing_user =>
				users
					.slice(0, users.indexOf(existing_user))
					.concat(updated_user)
					.concat(users.slice(users.indexOf(existing_user) + 1)),
			),
		)

const _check_exists =
	(key: "id" | "email" | "handle", value: string) => (users: User.PrivateUser[]) =>
		users.some(user => user[key] === value)
