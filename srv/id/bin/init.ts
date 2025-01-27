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

import { Oath, invokers0 } from "@ordo-pink/oath"
import { ConsoleLogger } from "@ordo-pink/logger"
import { type TAlgorithm } from "@ordo-pink/wjwt"
import { keys_of } from "@ordo-pink/tau"

const main = () =>
	Oath.If(!Bun.env.ORDO_ID_TOKEN_PUBLIC_KEY || !Bun.env.ORDO_ID_TOKEN_PRIVATE_KEY)
		.fix(() => process.exit(0))
		.and(() => alg0)
		.and(alg => Oath.FromPromise(() => crypto.subtle.generateKey(alg, true, ["sign", "verify"])))
		.and(({ privateKey, publicKey }) =>
			Oath.Merge({
				private_key: Oath.FromPromise(() => crypto.subtle.exportKey("pkcs8", privateKey))
					.and(key => Buffer.from(key))
					.and(key => key.toString("base64")),
				public_key: Oath.FromPromise(() => crypto.subtle.exportKey("spki", publicKey))
					.and(key => Buffer.from(key))
					.and(key => key.toString("base64")),
			}),
		)
		.and(({ private_key, public_key }) =>
			Oath.FromPromise(() => Bun.file(".env").text())
				.and(str => str.trim().split("\n"))
				.and(lines => lines.map(line => line.trim().split("=")))
				.and(lines => lines.reduce((acc, line) => ({ ...acc, [line[0]]: line[1] }), {} as Record<string, string>))
				.and(env => ({ ...env, ORDO_ID_TOKEN_PUBLIC_KEY: public_key, ORDO_ID_TOKEN_PRIVATE_KEY: private_key })),
		)
		.and(env => keys_of(env).reduce((acc, key) => acc.concat(key ? `${key}=${env[key]}\n` : "\n"), ""))
		.and(str => Bun.write(".env", str))
		.invoke(
			invokers0.or_else(e => {
				ConsoleLogger.panic(e)
				process.exit(1)
			}),
		)

void main()

// --- Internal ---

const alg0 = Oath.FromNullable(Bun.env.ORDO_ID_ALGORITHM)
	.fix(() => "ECDSA:384")
	.and(a => a.split(":"))
	.and(([name, c]) => ({ name, hash: { name: `SHA-${c}` }, namedCurve: `P-${c}` }) as TAlgorithm)
