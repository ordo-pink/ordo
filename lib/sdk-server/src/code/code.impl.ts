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

import { CORE, core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { result } from "@ordo-pink/oss-result"
import { server } from "@ordo-pink/sdk-server"

import type * as T from "./code.types"

export const guard: T.Guard = (x): x is T.Instance =>
	core.fns.is_non_empty_string(x) && Number.parseInt(x).toString() === x && x.length === 6

export const create_service: T.CreateService = (codegen, lifetime_seconds, logger) => {
	const storage: T.Storage = new Map()

	const interval = setInterval(() => {
		const now = core.timestamp.create()

		for (const [email, values] of storage.entries()) {
			for (const value of values) {
				if (now - value[0] < lifetime_seconds) {
					storage.set(email, values.toSpliced(values.indexOf(value), 1))
					logger.debug("Removed outdated code for", server.user.obfuscate_email(email))
				}
			}
		}
	}, 5000).unref()

	return {
		assign_code: email => {
			const code = generate()

			return oath
				.from_nullable(storage.get(email))
				.pipe(oath.ops.fix(() => []))
				.pipe(oath.ops.chain(values => codegen.hash(code).pipe(oath.ops.map(hash => [values, hash]))))
				.pipe(oath.ops.map(([values, hash]) => [...values, [core.timestamp.create(), hash] as T.Value]))
				.pipe(oath.ops.map(values => storage.set(email, values)))
				.pipe(oath.ops.map(() => code))
		},

		verify_code: (email, code) =>
			oath
				.from_nullable(storage.get(email), enoent(CORE.RRR.REASON.USER_NOT_FOUND))
				.pipe(oath.ops.map(values => values.map(v => v[1])))
				.pipe(oath.ops.chain(hs => oath.any(hs.map(h => codegen.verify(code, h))).pipe(oath.ops.rmap(core.fns.head)))),

		die: () => {
			clearInterval(interval)
			storage.clear()
		},
	}
}

export const generate = () =>
	result
		.of(new Uint8Array(6))
		.pipe(result.ops.map(ua => crypto.getRandomValues(ua)))
		.pipe(result.ops.map(ns => ns.join("")))
		.pipe(result.ops.map(s => s.slice(0, 6)))
		.cata(result.catas.expect(() => "NGH"))

const enoent = curry(core.rrr.enoent)
