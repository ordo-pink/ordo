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

import { ConsoleLogger, type TLogger } from "@ordo-pink/logger"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { type TAlgorithm, WJWT } from "@ordo-pink/wjwt"
import { type TIDChamber, create_backend_id } from "@ordo-pink/backend-id"
import { is_finite_non_negative_int, is_finite_positive_int, is_port, is_positive_number } from "@ordo-pink/tau"
import { PersistenceStategyUserFS } from "@ordo-pink/backend-persistence-strategy-user-fs"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	Oath.Merge({
		port: Oath.FromNullable(Bun.env.ORDO_ID_PORT)
			.and(n => Oath.If(is_port(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_PORT"))),

		allow_origin: Oath.FromNullable(Bun.env.ORDO_ID_ALLOW_ORIGIN)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_ALLOW_ORIGIN"))),

		aud: Oath.FromNullable(Bun.env.ORDO_ID_AUD)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_AUD"))),

		iss: Oath.FromNullable(Bun.env.ORDO_ID_ISS, env_rrr("ORDO_ID_ISS")),

		jwt: Oath.FromNullable(Bun.env.ORDO_ID_ALGORITHM)
			.fix(() => "ECDSA:384")
			.and(a => a.split(":"))
			.and(([name, c]) => ({ name, hash: { name: `SHA-${c}` }, namedCurve: `P-${c}` }) as TAlgorithm)
			.and(alg =>
				Oath.Merge({
					alg,
					private_key: Oath.FromNullable(Bun.env.ORDO_ID_TOKEN_PRIVATE_KEY)
						.and(k => decode_base64_key(k, alg, "private"))
						.pipe(ops0.rejected_map(env_rrr("ORDO_ID_TOKEN_PRIVATE_KEY"))),
					public_key: Oath.FromNullable(Bun.env.ORDO_ID_TOKEN_PUBLIC_KEY)
						.and(k => decode_base64_key(k, alg, "public"))
						.pipe(ops0.rejected_map(env_rrr("ORDO_ID_TOKEN_PUBLIC_KEY"))),
				}),
			),

		file_limit: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_FILE_LIMIT)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_FILE_LIMIT"))),

		max_upload_size: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE)
			.and(s => Number.parseFloat(s))
			.and(n => Oath.If(is_positive_number(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE"))),

		max_functions: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_MAX_FUNCTIONS)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_non_negative_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_MAX_FUNCTIONS"))),

		token_lifetime: Oath.FromNullable(Bun.env.ORDO_ID_TOKEN_LIFETIME)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_TOKEN_LIFETIME"))),

		user_db_path: Oath.FromNullable(Bun.env.ORDO_ID_USER_DB_PATH, env_rrr("ORDO_ID_USER_DB_PATH")),
	})

const main = () =>
	get_env()
		.and(
			({
				allow_origin,
				aud,
				iss,
				port,
				jwt: { alg, private_key, public_key },
				user_db_path,
				file_limit,
				max_functions,
				max_upload_size,
				token_lifetime,
			}) =>
				Oath.Merge({
					logger,
					wjwt: WJWT({ aud, alg, private_key, public_key, iss, token_lifetime }),
					user_persistence_strategy: PersistenceStategyUserFS.Of(user_db_path),
					notification_strategy: {
						send_email: ({ content }) => logger.notice("NOTIFICATION:", "::", content),
					}, // TODO
					allow_origin,
					token_persistence_strategy: "hello" as any, // TODO
					defaults: { file_limit, max_functions, max_upload_size },
				} satisfies TIDChamber)
					.and(create_backend_id)
					.and(fetch => Bun.serve({ fetch, port })),
		)
		.pipe(ops0.tap(server => logger.info(`server running on http://${server.hostname}:${server.port}`)))
		.invoke(
			invokers0.or_else(e => {
				logger.panic(e)
				process.exit(1)
			}),
		)

void main()

// --- Internal ---

const logger: TLogger = {
	alert: (...message) => ConsoleLogger.alert("[ID]", ...message),
	crit: (...message) => ConsoleLogger.crit("[ID]", ...message),
	debug: (...message) => ConsoleLogger.debug("[ID]", ...message),
	error: (...message) => ConsoleLogger.error("[ID]", ...message),
	info: (...message) => ConsoleLogger.info("[ID]", ...message),
	notice: (...message) => ConsoleLogger.notice("[ID]", ...message),
	panic: (...message) => ConsoleLogger.panic("[ID]", ...message),
	warn: (...message) => ConsoleLogger.warn("[ID]", ...message),
}

const decode_base64_key = (key: string, alg: TAlgorithm, type: "public" | "private") =>
	Oath.FromNullable(key)
		.and(key => Buffer.from(key, "base64"))
		.and(buffer => new Uint8Array(buffer))
		.and(key =>
			Oath.FromPromise<CryptoKey>(() =>
				type === "private"
					? crypto.subtle.importKey("pkcs8", key, alg, true, ["sign"])
					: crypto.subtle.importKey("spki", key, alg, true, ["verify"]),
			),
		)
