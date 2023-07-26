// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// deno-lint-ignore-file no-explicit-any

import type { T as US } from "#lib/user-service/mod.ts"
import type * as T from "./types.ts"

import { Oath } from "#lib/oath/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

const adapter: T.Fn = params => ({
	create: create(params),
	update: update(params),
	existsByEmail: existsByEmail(params),
	existsById: existsById(params),
	getByEmail: getByEmail(params),
	getById: getById(params),
})

export const DenoKVUserStorageAdapter = {
	of: async ({ path, key = "users" }: T.Config) => {
		const db = await (Deno as any).openKv(path)
		const idKey = `${key}_id`
		const emailKey = `${key}_email`

		return adapter({ db, idKey, emailKey })
	},
}

// INTERNAL ---------------------------------------------------------------------------------------

const create: US.CreateMethod<T.Params> =
	({ db, idKey, emailKey }) =>
	user =>
		Oath.try(() =>
			db.atomic().set([idKey, user.id], user).set([emailKey, user.email], user).commit()
		).chain(res =>
			Oath.fromBoolean(
				() => res.ok,
				() => user,
				() => new Error("User with given email already exists")
			)
		)

const update: US.UpdateMethod<T.Params> =
	({ db, idKey, emailKey }) =>
	(id, user) =>
		Oath.try(() => db.get([idKey, id]))
			.chain(res => Oath.fromNullable(res.value))
			.map(oldUser => ({ ...oldUser, ...user, id: oldUser.id, createdAt: oldUser.createdAt }))
			// TODO: Check if email is already taken
			.chain(newUser =>
				user.email
					? Oath.try(() =>
							db
								.atomic()
								.delete([emailKey, user.email])
								.set([idKey, user.id], newUser)
								.set([emailKey, newUser.email], newUser)
								.commit()
					  ).chain(res =>
							Oath.fromBoolean(
								() => res.ok,
								() => newUser,
								() => null
							)
					  )
					: Oath.try(() =>
							db
								.atomic()
								.set([idKey, user.id], newUser)
								.set([emailKey, user.email], newUser)
								.commit()
					  ).chain(res =>
							Oath.fromBoolean(
								() => res.ok,
								() => newUser,
								() => null
							)
					  )
			)

const getByEmail: US.GetByEmailMethod<T.Params> =
	({ db, emailKey }) =>
	email =>
		Oath.try(() => db.get([emailKey, email])).chain(res => Oath.fromNullable(res.value))

const getById: US.GetByIdMethod<T.Params> =
	({ db, idKey }) =>
	id =>
		Oath.try(() => db.get([idKey, id])).chain(res => Oath.fromNullable(res.value))

const existsByEmail: US.ExistsByEmailMethod<T.Params> = params => email =>
	adapter(params)
		.getByEmail(email)
		.map(() => true)
		.catch(() => false)

const existsById: US.ExistsByIdMethod<T.Params> = params => id =>
	adapter(params)
		.getById(id)
		.map(() => true)
		.catch(() => false)
