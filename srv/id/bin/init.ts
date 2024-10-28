// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { read_file0, write_file0 } from "@ordo-pink/fs"
import { die } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"
import { keys_of } from "@ordo-pink/tau"

const {
	ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY,
	ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY,
	ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY,
	ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY,
} = getc([
	"ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY",
	"ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY",
	"ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY",
	"ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY",
])

const generateKeyPairP = async () => {
	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-384" },
		true,
		["sign", "verify"],
	)

	const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey)
	const exportedPublicKey = await crypto.subtle.exportKey("spki", publicKey)

	const priv = Buffer.from(exportedPrivateKey).toString("base64")
	const pub = Buffer.from(exportedPublicKey).toString("base64")

	return { priv, pub }
}

const main = () => {
	if (
		!!ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY &&
		!!ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY &&
		!!ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY &&
		!!ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY
	) {
		return
	}

	void read_file0("./.env", "utf-8")
		.pipe(ops0.map(str => (str as string).trim().split("\n")))
		.pipe(ops0.map(lines => lines.map(line => line.trim().split("="))))
		.pipe(
			ops0.map(lines =>
				lines.reduce((acc, line) => ({ ...acc, [line[0]]: line[1] }), {} as Record<string, string>),
			),
		)
		.pipe(
			ops0.chain(env =>
				Oath.FromPromise(() => generateKeyPairP()).pipe(
					ops0.map(({ priv, pub }) => ({
						...env,
						ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY: priv,
						ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY: pub,
					})),
				),
			),
		)
		.pipe(
			ops0.chain(env =>
				Oath.FromPromise(() => generateKeyPairP()).pipe(
					ops0.map(({ priv, pub }) => ({
						...env,
						ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY: priv,
						ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY: pub,
					})),
				),
			),
		)
		.pipe(
			ops0.map(env => keys_of(env).reduce((acc, key) => acc.concat(`${key}=${env[key]}\n`), "")),
		)
		.pipe(ops0.chain(str => write_file0("./.env", str, "utf-8")))
		.invoke(invokers0.or_else(die()))
}

main()
