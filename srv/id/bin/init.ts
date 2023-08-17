// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { resolve } from "#std/path/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"
import { encode } from "#std/encoding/base64.ts"
import { getc } from "#lib/getc/mod.ts"
import { createDirectoryIfNotExists, createParentDirectoryFor } from "#lib/fs/mod.ts"

// TODO: write configuration updates to dotenvs

const {
	ID_KV_DB_PATH,
	ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
	ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
	ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
	ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
} = getc([
	"ID_KV_DB_PATH",
	"ID_ACCESS_TOKEN_PRIVATE_KEY_PATH",
	"ID_ACCESS_TOKEN_PUBLIC_KEY_PATH",
	"ID_REFRESH_TOKEN_PRIVATE_KEY_PATH",
	"ID_REFRESH_TOKEN_PUBLIC_KEY_PATH",
])

const generateKeyPair = async (privatePath: string, publicPath: string) => {
	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-384" },
		true,
		["sign", "verify"]
	)

	const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey)
	const exportedPublicKey = await crypto.subtle.exportKey("spki", publicKey)

	const key = `-----BEGIN PRIVATE KEY-----
${encode(exportedPrivateKey)
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PRIVATE KEY-----`
	const pub = `-----BEGIN PUBLIC KEY-----
${encode(exportedPublicKey)
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PUBLIC KEY-----`

	await Deno.writeFile(privatePath, new TextEncoder().encode(key))
	await Deno.writeFile(publicPath, new TextEncoder().encode(pub))
}

const generateAuthKeys = async () => {
	const keys = [
		ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
		ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
		ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
		ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
	]

	for (const key of keys) {
		await createParentDirectoryFor(key).toPromise()
	}

	await generateKeyPair(
		resolve(ID_ACCESS_TOKEN_PRIVATE_KEY_PATH),
		resolve(ID_ACCESS_TOKEN_PUBLIC_KEY_PATH)
	)

	await generateKeyPair(
		resolve(ID_REFRESH_TOKEN_PRIVATE_KEY_PATH),
		resolve(ID_REFRESH_TOKEN_PUBLIC_KEY_PATH)
	)
}

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Creating directories...`))
	await createDirectoryIfNotExists(ID_KV_DB_PATH).orElse(console.error)
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Generating auth keys...`))
	await generateAuthKeys()
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
