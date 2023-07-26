// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { decode } from "#std/encoding/base64.ts"
import { Either } from "#lib/either/mod.ts"

export const getKey = (path: string, type: "public" | "private") =>
	Either.fromNullable(path)
		.chain(path => Either.try(() => Deno.statSync(path)))
		.map(() => path)
		.map(Deno.readFileSync)
		.map(x => new TextDecoder().decode(x))
		.map(s => s.split("\n"))
		.map(ss => ss.slice(1, -1))
		.map(ss => ss.join(""))
		.map(decode)
		.map(key =>
			crypto.subtle.importKey(
				type === "private" ? "pkcs8" : "spki",
				key,
				{ name: "ECDSA", namedCurve: "P-384" },
				false,
				type === "private" ? ["sign"] : ["verify"]
			)
		)
		.fold(
			() => {
				console.error(
					// TODO: Rename when renaming "bin/dev"
					`${path} not found. Run "bin/dev" to create a dev pair, or provide production-ready key pair.`
				)
				Deno.exit(1)
			},
			x => x
		)

export const getPublicKey = (path: string) => getKey(path, "public")
export const getPrivateKey = (path: string) => getKey(path, "private")
