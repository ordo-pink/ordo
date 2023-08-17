// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { isFile0, readFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const getKey = (path: string, type: "public" | "private") =>
	Oath.fromNullable(path)
		.chain(isFile0)
		.map(() => path)
		.chain(path => readFile0(path, "utf-8"))
		.map(s => (s as string).split("\n"))
		.map(ss => ss.slice(1, -1))
		.map(ss => ss.flatMap(line => line.split("")))
		.map(cs => cs.map(char => char.charCodeAt(0)))
		.map(ns => Uint8Array.from(ns))
		.fork(
			() => {
				console.error(
					// TODO: Rename when renaming "bin/dev"
					`${path} not found. Run "bin/dev" to create a dev pair, or provide production-ready key pair.`,
				)
				process.exit(1)
			},
			key =>
				crypto.subtle.importKey(
					type === "private" ? "pkcs8" : "spki",
					key,
					{ name: "ECDSA", namedCurve: "P-384" },
					false,
					type === "private" ? ["sign"] : ["verify"],
				),
		)

export const getPublicKey = (path: string) => getKey(path, "public")
export const getPrivateKey = (path: string) => getKey(path, "private")
