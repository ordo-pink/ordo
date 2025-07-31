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

import { type Core, core } from "@ordo-pink/sdk-core"
import type { Server } from "@ordo-pink/sdk-server"
import { codegen_strategy_bun } from "@ordo-pink/b-strategy-codegen-bun"
import { data_repository_fs } from "@ordo-pink/b-repository-data-fs"
import { server_au } from "@ordo-pink/backend-server-au"
import { user_repository_data } from "@ordo-pink/b-repository-user-repository-data"

const main = () => {
	const raw_allow_origin = Bun.env.ORDO_AU_ALLOW_ORIGIN ?? bad_env("Missing ORDO_AU_ALLOW_ORIGIN")
	const raw_code_lifetime = Bun.env.ORDO_AU_CODE_LIFETIME_MS ?? bad_env("Missing ORDO_AU_CODE_LIFETIME_MS")
	const raw_session_lifetime = Bun.env.ORDO_AU_SESSION_LIFETIME_SECONDS ?? bad_env("Missing ORDO_AU_SESSION_LIFETIME_SECONDS")
	const root = Bun.env.ORDO_AU_DATA_ROOT ?? bad_env("Missing ORDO_AU_DATA_ROOT")
	const algorithm = (Bun.env.ORDO_AU_CODE_ALGORITHM as Bun.Password.AlgorithmLabel) ?? bad_env("Missing ORDO_AU_CODE_ALGORITHM")
	const cache_user_id = (Bun.env.ORDO_AU_CACHE_USER_ID as Core.User.Id) ?? bad_env("Missing ORDO_AU_CACHE_USER_ID")
	const cache_file_id = (Bun.env.ORDO_AU_CACHE_FILE_ID as Core.Data.Id) ?? bad_env("Missing ORDO_AU_CACHE_FILE_ID")
	const user_file_id = (Bun.env.ORDO_AU_USER_FILE_ID as Core.Data.Id) ?? bad_env("Missing ORDO_AU_USER_FILE_ID")
	const allow_origin = raw_allow_origin.split(", ")
	const port = Number.parseInt(Bun.env.ORDO_AU_PORT ?? "3001")
	const code_lifetime_ms = Number.parseInt(raw_code_lifetime, 10)
	const session_lifetime_seconds = Number.parseInt(raw_session_lifetime, 10)

	if (algorithm !== "argon2d" && algorithm !== "argon2i" && algorithm !== "argon2id" && algorithm !== "bcrypt")
		bad_env("ORDO_CODE_ALGORITHM must be 'argon2d', 'argon2i', 'argon2id' or 'bcrypt'")

	if (!core.uuid.guard(cache_user_id)) bad_env("ORDO_CACHE_USER_ID must be a valid user id")
	if (!core.uuid.guard(cache_file_id)) bad_env("ORDO_CACHE_FILE_ID must be a valid data id")
	if (!core.uuid.guard(user_file_id)) bad_env("ORDO_USER_FILE_ID must be a valid data id")

	// const ORDO_RUSENDER_KEY = Bun.env.ORDO_RUSENDER_KEY ?? die_missing("ORDO_RUSENDER_KEY")
	// const ORDO_EMAIL_SENDER_EMAIL = Bun.env.ORDO_EMAIL_SENDER_EMAIL ?? die_missing("ORDO_EMAIL_SENDER_EMAIL")
	// const ORDO_EMAIL_SENDER_NAME = Bun.env.ORDO_EMAIL_SENDER_NAME ?? die_missing("ORDO_EMAIL_SENDER_NAME")
	// const rusender_key = Bun.env.ORDO_RUSENDER_KEY
	// const sender = { email: Bun.env.ORDO_EMAIL_SENDER_EMAIL, name: Bun.env.ORDO_EMAIL_SENDER_NAME }
	// const email_strategy = email_strategy_rusender.create(rusender_key, sender)

	const data_repository = data_repository_fs.create(root)
	const user_repository = user_repository_data.create(data_repository, cache_user_id, cache_file_id, user_file_id)
	const code_strategy = codegen_strategy_bun.create(algorithm)
	const email_strategy: Server.Email.Strategy = {
		send: (...args) => Promise.resolve(logger.notice("NOTIFICATION:", "::", args[2])),
	}

	const fetch = server_au.create(
		allow_origin,
		code_lifetime_ms,
		code_strategy,
		data_repository,
		email_strategy,
		logger,
		session_lifetime_seconds,
		user_repository,
	)

	const server = Bun.serve({ fetch, port })
	logger.info(`server running on http://${server.hostname}:${server.port}`)
}

// --- Internal ---

const logger: Core.Logger = {
	alert: (...message) => core.logger.stout.alert("[AU]", ...message),
	crit: (...message) => core.logger.stout.crit("[AU]", ...message),
	debug: (...message) => core.logger.stout.debug("[AU]", ...message),
	error: (...message) => core.logger.stout.error("[AU]", ...message),
	info: (...message) => core.logger.stout.info("[AU]", ...message),
	notice: (...message) => core.logger.stout.notice("[AU]", ...message),
	panic: (...message) => core.logger.stout.panic("[AU]", ...message),
	warn: (...message) => core.logger.stout.warn("[AU]", ...message),
}

void main()

const bad_env = (var_name: string): never => {
	logger.panic(`ERROR: ${var_name}`)
	process.exit(1)
}
