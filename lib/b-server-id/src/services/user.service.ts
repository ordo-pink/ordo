/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import type { User } from "../b-server-id.types"

export const create: User.CreateService = user_repository => {
	return {
		get_or_create_user0: email =>
			user_repository
				.read({ email, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(user => ({ is_new: false, user })))
				.pipe(
					oath.ops.fix(rrr =>
						rrr.type === ORDO.RRR.TYPE.ENOENT
							? user_repository.create(ordo.user.create(email)).pipe(oath.ops.map(user => ({ is_new: true, user })))
							: oath.reject(rrr),
					),
				),

		get_public_user_by_email0: email =>
			user_repository
				.read({ email, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(ordo.user.to_other_user)),

		get_public_user_by_ref0: ref =>
			user_repository
				.read({ ref, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(ordo.user.to_other_user)),

		get_user_by_id0: id =>
			user_repository
				.read({ id, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND)))),

		update_name0: ordo.fns.curry((id, name) =>
			user_repository
				.read({ id, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(u => [u[0], u[1], name, u[3], ordo.timestamp.create(), u[5]] satisfies Ordo.User.Instance))
				.pipe(oath.ops.chain(user_repository.update(id))),
		),

		update_email0: ordo.fns.curry((id, new_email) =>
			user_repository
				.read({ id, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(u => [u[0], u[1], u[2], u[3], ordo.timestamp.create(), new_email] satisfies Ordo.User.Instance))
				.pipe(oath.ops.chain(user_repository.update(id))),
		),

		update_ref0: ordo.fns.curry((id, new_ref) =>
			user_repository
				.read({ id, limit: 1 })
				.pipe(oath.ops.map(ordo.fns.head))
				.pipe(oath.ops.chain(u => oath.from_nullable(u, ordo.rrr.enoent(ORDO.RRR.REASON.USER_NOT_FOUND))))
				.pipe(oath.ops.map(u => [u[0], new_ref, u[2], u[3], ordo.timestamp.create(), u[5]] satisfies Ordo.User.Instance))
				.pipe(oath.ops.chain(user_repository.update(id))),
		),

		kill: () => void user_repository.kill(),
	}
}
