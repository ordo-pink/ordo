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

import { CurrentUser, CurrentUserKeys, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"

export const PersistenceStategyUserFS = {
	Of: (db_path: string): OrdoBackend.User.PersistenceStrategy => {
		const users0 = Oath.FromPromise(() => Bun.file(db_path).json() as Promise<Ordo.User.Current.DTO[]>)
			.pipe(ops0.map(dtos => dtos.map(CurrentUser.FromDTO)))
			.pipe(ops0.rejected_map(error => RRR.codes.eio(error.message, error.name, error.cause, error.stack)))

		const save_users = (users: Ordo.User.Current.Instance[]) =>
			Oath.Resolve(users.map(user => user.to_dto()))
				.pipe(ops0.map(dtos => dtos.map(dto => JSON.stringify(dto))))
				.pipe(ops0.chain(dtos => Oath.FromPromise(() => Bun.write(db_path, `[\n  ${dtos.join("\n  ")}\n]`))))
				.pipe(ops0.rejected_map(error => RRR.codes.eio(error.message, error.name, error.cause, error.stack)))

		return {
			create: user =>
				users0
					.pipe(
						ops0.chain(users => {
							const uid = user.get_uid()
							const email = user.get_email()
							const handle = user.get_handle()

							return Oath.Merge([
								Oath.If(!exists(users, CurrentUserKeys.UID, uid), { F: () => user_already_exists("id", uid) }),
								Oath.If(!exists(users, CurrentUserKeys.EMAIL, email), { F: () => user_already_exists("email", email) }),
								Oath.If(!exists(users, CurrentUserKeys.HANDLE, handle), { F: () => user_already_exists("handle", handle) }),
							]).pipe(ops0.map(() => users))
						}),
					)
					.pipe(ops0.chain(users => save_users([...users, user])))
					.pipe(ops0.map(() => user)),

			exists: id => users0.pipe(ops0.map(users => exists(users, CurrentUserKeys.UID, id))),

			read: id =>
				users0
					.pipe(ops0.map(users => users.find(u => u.get_uid() === id)))
					.pipe(ops0.chain(user => Oath.FromNullable(user, () => user_not_found(CurrentUserKeys.UID, id)))),

			delete: id =>
				users0
					.pipe(
						ops0.chain(users =>
							Oath.If(exists(users, CurrentUserKeys.UID, id), {
								T: () => users,
								F: () => user_not_found(CurrentUserKeys.UID, id),
							}),
						),
					)
					.pipe(ops0.map(users => users.filter(user => user.get_uid() !== id)))
					.pipe(ops0.chain(save_users))
					.pipe(ops0.map(noop)),

			update: (id, user) =>
				users0
					.pipe(
						ops0.chain(users =>
							Oath.If(exists(users, CurrentUserKeys.UID, id), {
								T: () => users,
								F: () => user_not_found(CurrentUserKeys.UID, id),
							}),
						),
					)
					.pipe(
						ops0.map(users =>
							users.toSpliced(
								users.findIndex(u => u.get_uid() === id),
								1,
								user,
							),
						),
					)
					.pipe(ops0.chain(save_users))
					.pipe(ops0.map(() => user)),
		}
	},
}

const exists = <$TKey extends CurrentUserKeys>(
	users: Ordo.User.Current.Instance[],
	key: $TKey,
	value: Ordo.User.Current.DTO[$TKey],
) => users.some(u => u.to_dto()[key] === value)

const user_already_exists = (key: string, value: unknown) => RRR.codes.eexist("user already exists", key, value)

const user_not_found = <$TKey extends keyof Ordo.User.Current.DTO>(key: $TKey, value: Ordo.User.Current.DTO[$TKey]) =>
	RRR.codes.enoent("user not found", key, value)
