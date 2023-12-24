// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { getc } from "@ordo-pink/getc"
import { readFile0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { keysOf } from "@ordo-pink/tau"
import { ConsoleLogger } from "@ordo-pink/logger"

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

const main = async () => {
	if (
		!!ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY &&
		!!ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY &&
		!!ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY &&
		!!ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY
	) {
		return
	}

	readFile0("./.env", "utf-8")
		.map(str => (str as string).trim().split("\n"))
		.map(lines => lines.map(line => line.trim().split("=")))
		.tap(console.log)
		.map(lines =>
			lines.reduce((acc, line) => ({ ...acc, [line[0]]: line[1] }), {} as Record<string, string>),
		)
		.chain(env =>
			Oath.from(() => generateKeyPairP()).map(({ priv, pub }) => ({
				...env,
				ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY: priv,
				ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY: pub,
			})),
		)
		.chain(env =>
			Oath.from(() => generateKeyPairP()).map(({ priv, pub }) => ({
				...env,
				ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY: priv,
				ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY: pub,
			})),
		)
		.map(env => keysOf(env).reduce((acc, key) => acc.concat(`${key}=${env[key]}\n`), ""))
		.chain(str => writeFile0("./.env", str, "utf-8"))
		.orElse(ConsoleLogger.error)
}

main()
