// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { getc } from "@ordo-pink/getc"
import { createParentIfNotExists0, writeFile0 } from "@ordo-pink/fs"
import { resolve } from "path"

const {
	ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
	ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
	ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
	ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
} = getc([
	"ID_ACCESS_TOKEN_PRIVATE_KEY_PATH",
	"ID_ACCESS_TOKEN_PUBLIC_KEY_PATH",
	"ID_REFRESH_TOKEN_PRIVATE_KEY_PATH",
	"ID_REFRESH_TOKEN_PUBLIC_KEY_PATH",
])

const generateKeyPair = async (privatePath: string, publicPath: string) => {
	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-384" },
		true,
		["sign", "verify"],
	)

	const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey)
	const exportedPublicKey = await crypto.subtle.exportKey("spki", publicKey)

	const key = `-----BEGIN PRIVATE KEY-----
${Buffer.from(exportedPrivateKey)
	.toString("base64")
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PRIVATE KEY-----`

	const pub = `-----BEGIN PUBLIC KEY-----
${Buffer.from(exportedPublicKey)
	.toString("base64")
	.match(/.{1,42}/g)
	?.join("\n")}
-----END PUBLIC KEY-----`

	await writeFile0(privatePath, key).orElse(console.error)
	await writeFile0(publicPath, pub).orElse(console.error)
}

const generateAuthKeys = async () => {
	const keys = [
		ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
		ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
		ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
		ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
	]

	for (const key of keys) {
		await createParentIfNotExists0(key).toPromise()
	}

	await generateKeyPair(
		resolve(ID_ACCESS_TOKEN_PRIVATE_KEY_PATH),
		resolve(ID_ACCESS_TOKEN_PUBLIC_KEY_PATH),
	)

	await generateKeyPair(
		resolve(ID_REFRESH_TOKEN_PRIVATE_KEY_PATH),
		resolve(ID_REFRESH_TOKEN_PUBLIC_KEY_PATH),
	)
}

const main = async () => {
	await generateAuthKeys()
}

main()
