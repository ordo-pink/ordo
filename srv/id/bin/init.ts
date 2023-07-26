// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join, resolve } from "#std/path/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"
import { encode } from "#std/encoding/base64.ts"
import { getc } from "#lib/getc/mod.ts"
import { getParentPath } from "#lib/fs/mod.ts"

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

const createRequiredDirectories = async () => {
	const dbDirectoryPath = resolve(ID_KV_DB_PATH)
	const dbDirectoryExists = await Deno.stat(dbDirectoryPath).catch(() => ({
		isDirectory: false,
	}))

	if (!dbDirectoryExists || !dbDirectoryExists.isDirectory) {
		await Deno.mkdir(dbDirectoryPath, { recursive: true })
	}
}

const generateAuthKeys = async () => {
	const keys = [
		ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
		ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
		ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
		ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
	]

	for (const key of keys) {
		const parentPath = getParentPath(key)
		const parentPathExists = await Deno.stat(parentPath).catch(() => ({
			isDirectory: false,
		}))

		if (!parentPathExists || !parentPathExists.isDirectory) {
			await Deno.mkdir(parentPath, { recursive: true })
		}
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
	await createRequiredDirectories()
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))

	Deno.stdout.write(encoder.encode(`  ${cyan("→")} Generating auth keys...`))
	await generateAuthKeys()
	Deno.stdout.write(encoder.encode(` ${green("✓")}\n`))
}

await main()
