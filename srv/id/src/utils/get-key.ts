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
		.fork(
			() => {
				console.error(
					// TODO: Rename when renaming "bin/dev"
					`${path} not found. Run "bin/dev" to create a dev pair, or provide production-ready key pair.`,
				)
				process.exit(1)
			},
			key => key,
		)

export const getPublicKey = (path: string) => getKey(path, "public") as Promise<string>
export const getPrivateKey = (path: string) => getKey(path, "private") as Promise<string>
