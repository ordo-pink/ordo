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

import { core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oss-oath"
import { server_routary } from "@ordo-pink/sdk-server-routary"

const init = async () => {
	const public_key = Bun.env.ORDO_ID_SESSION_TOKEN_PUBLIC_KEY
	const private_key = Bun.env.ORDO_ID_SESSION_TOKEN_PRIVATE_KEY

	if (!public_key || !private_key) {
		core.logger.stout.warn("ID: Missing session token keys in your env. Generating a pair based on your config...")

		const alg_name = Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM
		const alg_params = Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM_PARAMS
		const { priv, pub } = await create_keys(alg_name, alg_params).cata(oath.catas.or_else(handle_creation_error))

		const dotenv_file = Bun.file(".env")
		const dotenv = await dotenv_file.text()
		await dotenv_file.write(
			dotenv
				.replace(/ORDO_ID_SESSION_TOKEN_PUBLIC_KEY=.*/, `ORDO_ID_SESSION_TOKEN_PUBLIC_KEY='${pub}'`)
				.replace(/ORDO_ID_SESSION_TOKEN_PRIVATE_KEY=.*/, `ORDO_ID_SESSION_TOKEN_PRIVATE_KEY='${priv}'`),
		)

		core.logger.stout.info(
			"ID: Added missing keys to .env (see ORDO_ID_SESSION_TOKEN_PUBLIC_KEY and ORDO_ID_SESSION_TOKEN_PRIVATE_KEY)",
		)
	}
}

// --- Internal ---

const handle_creation_error = (error: unknown) => {
	core.logger.stout.panic("ID: UNEXPECTED ERROR", error)
	process.exit(1)
}

const create_keys = (alg_name?: string, alg_params?: string) =>
	create_alg(alg_name, alg_params)
		.pipe(oath.ops.map(({ name, params }) => ({ name, ...(params as any) })))
		.pipe(oath.ops.chain(x => oath.from_promise(() => crypto.subtle.generateKey(x, true, ["sign", "verify"]))))
		.pipe(oath.ops.chain(({ privateKey, publicKey }) => oath.merge({ priv: to_jwk(privateKey), pub: to_jwk(publicKey) })))

const create_alg = (alg_name?: string, alg_params?: string) =>
	oath.merge({
		name: oath.from_nullable(alg_name),
		params: oath.from_nullable(alg_params).pipe(oath.ops.chain(server_routary.oaths.to_json)),
	})

const to_jwk = (key: CryptoKey) =>
	oath.from_promise(() => crypto.subtle.exportKey("jwk", key)).pipe(oath.ops.chain(server_routary.oaths.to_json))

void init()
