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

import { hunt as lib_hunt } from "@ordo-pink/oss-hunt"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"
import { server } from "@ordo-pink/sdk-server"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "./b-server-id.types"
import * as handlers from "./handlers"

export const create: Lib.Create = (
	logger,
	user_repository,
	code_lifetime_seconds,
	session_lifetime_minutes,
	_email_strategy,
	allowed_origins,
	codegen,
	wjwt,
) => {
	const hunter = lib_hunt.begin<Lib.Prey>()

	const allowed_headers = ["Content-Type", "Accept-Language", "X-Device"]
	const allow_credentials = true
	const code_service = server.code.create_service(codegen, code_lifetime_seconds, logger)

	// TODO Send email
	const release_auth_requested = hunter.track("auth.requested", ([user, code]) => logger.debug(user[0], code))

	process.on("exit", () => {
		release_auth_requested()
		code_service.die()
	})

	return server_routary
		.create({ code_service, logger, hunter, session_lifetime_minutes, user_repository, wjwt })
		.pipe(routary.ops.once(routary_cors.create(allowed_origins, allowed_headers, allow_credentials)))
		.pipe(routary.ops.post("/auth/request-code", handlers.request_code))
		.pipe(routary.ops.post("/auth/verify-code", handlers.verify_code))
		.pipe(routary.ops.post("/auth", handlers.auth_refresh))
		.pipe(routary.ops.delete("/auth", handlers.auth_kill))
		.pipe(routary.ops.get("/users/email/:email", handlers.get_user_by_email))
		.pipe(routary.ops.patch("/users/email/:id", handlers.update_email))
		.pipe(routary.ops.get("/users/ref/:ref", handlers.get_user_by_ref))
		.pipe(routary.ops.patch("/users/ref/:id", handlers.update_ref))
		.pipe(routary.ops.get("/users/:id", handlers.get_user_by_id))
		.pipe(routary.ops.patch("/users/:id", handlers.update_user))
		.pipe(routary.ops.delete("/users/:id", handlers.delete_user))
}

export const guard: T.Guard = (x): x is T.Instance =>
	ordo.fns.is_non_empty_string(x) && Number.parseInt(x).toString() === x && x.length === 6

export const create_service: T.CreateService = (codegen, lifetime_seconds, logger) => {
	const storage: T.Storage = new Map()

	const interval = setInterval(() => {
		const now = ordo.timestamp.create()

		for (const [email, values] of storage.entries()) {
			for (const value of values) {
				if (now - value[0] < lifetime_seconds) {
					storage.set(email, values.toSpliced(values.indexOf(value), 1))
					logger.debug("Removed outdated code for", user.obfuscate_email(email))
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
				.pipe(oath.ops.map(([values, hash]) => [...values, [ordo.timestamp.create(), hash] as T.Value]))
				.pipe(oath.ops.map(values => storage.set(email, values)))
				.pipe(oath.ops.map(() => code))
		},

		verify_code: (email, code) =>
			oath
				.from_nullable(storage.get(email), enoent(ordo.rrr.REASON.USER_NOT_FOUND))
				.pipe(oath.ops.map(values => values.map(v => v[1])))
				.pipe(oath.ops.chain(hs => oath.any(hs.map(h => codegen.verify(code, h))).pipe(oath.ops.rmap(ordo.fns.head)))),

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

const enoent = ordo.fns.curry(ordo.rrr.enoent)
