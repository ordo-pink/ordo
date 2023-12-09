// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { getc } from "@ordo-pink/getc"
import { readFile0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { isString } from "@ordo-pink/tau"

const {
	ID_ACCESS_TOKEN_PRIVATE_KEY,
	ID_ACCESS_TOKEN_PUBLIC_KEY,
	ID_REFRESH_TOKEN_PRIVATE_KEY,
	ID_REFRESH_TOKEN_PUBLIC_KEY,
} = getc([
	"ID_ACCESS_TOKEN_PRIVATE_KEY",
	"ID_ACCESS_TOKEN_PUBLIC_KEY",
	"ID_REFRESH_TOKEN_PRIVATE_KEY",
	"ID_REFRESH_TOKEN_PUBLIC_KEY",
])

const main = async () => {
	if (!ID_ACCESS_TOKEN_PRIVATE_KEY || !ID_ACCESS_TOKEN_PUBLIC_KEY) {
		await Oath.from(() => generateKeyPair())
			.chain(({ privateKey, publicKey }) =>
				registerKeyPairInDotEnv0({ privateKey, publicKey, type: "ACCESS" }),
			)
			.orElse(console.log)
	}

	if (!ID_REFRESH_TOKEN_PRIVATE_KEY || !ID_REFRESH_TOKEN_PUBLIC_KEY) {
		await Oath.from(() => generateKeyPair())
			.chain(({ privateKey, publicKey }) =>
				registerKeyPairInDotEnv0({ privateKey, publicKey, type: "REFRESH" }),
			)
			.orElse(console.log)
	}
}

main()

// --- Internal ---

type AccessLevel = "PRIVATE" | "PUBLIC"
type TokenType = "ACCESS" | "REFRESH"

/**
 * Generate a key pair with Web Crypto Subtle module.
 * TODO: Allow using RSA and HSA via env variable.
 */
const generateKeyPair = async () => {
	const originalKeys = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-384" },
		true,
		["sign", "verify"],
	)

	const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", originalKeys.privateKey)
	const exportedPublicKey = await crypto.subtle.exportKey("spki", originalKeys.publicKey)

	const privateKey = Buffer.from(exportedPrivateKey).toString("base64")
	const publicKey = Buffer.from(exportedPublicKey).toString("base64")

	return { privateKey, publicKey }
}

type RegisterKeyPairInDotEnvParams = { privateKey: string; publicKey: string; type: TokenType }
const registerKeyPairInDotEnv0 = ({ privateKey, publicKey, type }: RegisterKeyPairInDotEnvParams) =>
	readFile0("./.env", "utf-8")
		.chain(Oath.ifElse(isString, { onTrue: str => (str as string).split("\n") }))
		.chain(registerKeyInDotEnv_0({ access: "PRIVATE", key: privateKey, type }))
		.chain(registerKeyInDotEnv_0({ access: "PUBLIC", key: publicKey, type }))
		.chain(lines => writeFile0("./.env", lines.join("\n"), "utf-8"))

type RegisterKeyInDotEnvParams = { access: AccessLevel; type: TokenType; key: string }
const registerKeyInDotEnv_0 =
	({ type, access, key }: RegisterKeyInDotEnvParams) =>
	(lines: string[]) =>
		Oath.of(lines.findIndex(line => line.startsWith(`ID_${type}_TOKEN_${access}_KEY=`)))
			.tap(lineIndex =>
				lineIndex >= 0
					? lines.splice(lineIndex, 1, `ID_${type}_TOKEN_${access}_KEY=${key}`)
					: lines.push(`ID_${type}_TOKEN_${access}_KEY=${key}`),
			)
			.map(() => lines)
