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

import { type Code } from "../b-server-id.types"

export const create: Code.CreateService = (hashing_strategy, repository) => {
	return {
		create0: ordo.fns.curry((email, usage) =>
			oath
				.of(new Uint8Array(6))
				.pipe(oath.ops.map(ua => crypto.getRandomValues(ua)))
				.pipe(oath.ops.map(ns => ns.join("")))
				.pipe(oath.ops.map(s => s.slice(0, 6)))
				.pipe(
					oath.ops.chain(c =>
						oath
							.of([ordo.timestamp.create(), hashing_strategy.hash(c), usage])
							.pipe(
								oath.ops.chain(v =>
									repository
										.read(email)
										.pipe(oath.ops.map(vs => (vs ? [...vs, v] : [v]) as Ordo.Code.Server.Instance[]))
										.pipe(oath.ops.chain(vs => repository.update(email, vs))),
								),
							)
							.pipe(oath.ops.map(() => c)),
					),
				),
		),

		verify0: ordo.fns.curry((email, code, usage) =>
			repository
				.read(email)
				.pipe(oath.ops.map(vs => vs.filter(v => v[2] === usage)))
				.pipe(oath.ops.chain(vs => oath.any(vs.map(v => hashing_strategy.verify(code, v[1])))))
				.pipe(oath.ops.rmap(rrr => (ordo.validations.is_array(rrr) ? rrr[0] : rrr))),
		),

		kill: () => void repository.kill(),
	}
}
