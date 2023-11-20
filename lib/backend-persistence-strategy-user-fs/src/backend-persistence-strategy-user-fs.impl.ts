// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { UserPersistenceStrategy } from "@ordo-pink/backend-service-user"
import { User } from "@ordo-pink/frontend-core"
import { readFile0, writeFileRecursive0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

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

export const FSUserRepository = { of }
