// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { isFile0, readFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const getKey = (path: string, type: "public" | "private", alg: Algorithm) =>
	Oath.fromNullable(path)
		.chain(isFile0)
		.map(() => path)
		.chain(path => readFile0(path, "utf-8"))
		.map(key => (key as string).split("\n").slice(1, -1).join(""))
		.map(key => Buffer.from(key, "base64"))
		.map(buffer => new Uint8Array(buffer))
		.chain(key =>
			Oath.from(() =>
				type === "private"
					? crypto.subtle.importKey("pkcs8", key, alg, true, ["sign"])
					: crypto.subtle.importKey("spki", key, alg, true, ["verify"]),
			),
		)
		.orElse(e => {
			console.error(e)
			process.exit(1)
		})

export const getPublicKey = (path: string, alg: Algorithm) => getKey(path, "public", alg)
export const getPrivateKey = (path: string, alg: Algorithm) => getKey(path, "private", alg)
