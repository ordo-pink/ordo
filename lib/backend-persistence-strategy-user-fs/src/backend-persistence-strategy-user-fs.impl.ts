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

import { readFile0, writeFileRecursive0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { type UserPersistenceStrategy } from "@ordo-pink/backend-service-user"

const getUsers0 = (path: string): Oath<User.InternalUser[], Error> =>
	readFile0(path, "utf-8")
		.fix(() => writeFileRecursive0(path, "[]", "utf-8").map(() => "[]"))
		.chain(file => Oath.try(() => JSON.parse(file as string)))

const saveUsers0 = (path: string, data: User.InternalUser[]) =>
	Oath.try(() => JSON.stringify(data)).chain(file => writeFileRecursive0(path, file, "utf-8"))

const of = (path: string): UserPersistenceStrategy => ({
	create: user =>
		getUsers0(path)
			.chain(users => saveUsers0(path, [...users, user]))
			.map(() => user),
	existsByEmail: email => getUsers0(path).map(users => users.some(user => user.email === email)),
	existsById: id => getUsers0(path).map(users => users.some(user => user.id === id)),
	getByEmail: email =>
		getUsers0(path).chain(users => Oath.fromNullable(users.find(user => user.email === email))),
	getById: id =>
		getUsers0(path).chain(users => Oath.fromNullable(users.find(user => user.id === id))),
	update: (id, user) =>
		getUsers0(path).chain(users =>
			Oath.fromNullable(users.find(user => user.id === id)).chain(oldUser => {
				users.splice(users.indexOf(oldUser), 1, { ...oldUser, ...user })
				return Oath.of(users)
					.chain(updatedUsers => saveUsers0(path, updatedUsers))
					.map(() => ({ ...oldUser, ...user }))
			}),
		),
})

export const PersistenceStrategyUserFS = { of }
