// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { TokenRecord, TokenPersistenceStrategy } from "@ordo-pink/backend-service-token"
import { createParentIfNotExists0, fileExists0, readFile0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { SUB } from "@ordo-pink/wjwt"

let storage = {} as Record<SUB, TokenRecord>

export const TokenPersistenceStrategyMemory = {
	of: async (path: string): Promise<TokenPersistenceStrategy> => {
		await fileExists0(path)
			.chain(
				Oath.ifElse(x => x, {
					// TODO: Unwrap if provided functions return Oath/Promise
					onTrue: () =>
						readFile0(path, "utf-8")
							.map(text => JSON.parse(text as string) as typeof storage)
							.fix(() => ({} as typeof storage)),
					onFalse: () =>
						createParentIfNotExists0(path).chain(() =>
							writeFile0(path, "{}", "utf-8").map(() => ({} as typeof storage)),
						),
				}),
			)
			.chain(x => x)
			.tap(strg => void (storage = strg))
			.orElse(console.log)

		return {
			getToken: (sub, jti) =>
				Oath.fromNullable(storage[sub])
					.chain(record => Oath.fromNullable(record[jti]))
					.fix(() => null),
			getTokenRecord: sub => Oath.fromNullable(storage[sub]).fix(() => null),
			removeToken: (sub, jti) =>
				Oath.fromNullable(storage[sub])
					.chain(record => Oath.fromNullable(record[jti]))
					.map(() => delete storage[sub][jti])
					.chain(() => writeFile0(path, JSON.stringify(storage), "utf-8"))
					.fix(() => null)
					.map(() => "OK"),
			removeTokenRecord: sub =>
				Oath.fromNullable(storage[sub])
					.fix(() => null)
					.map(() => delete storage[sub])
					.chain(() => writeFile0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
			setToken: (sub, jti, token) =>
				Oath.fromNullable(storage[sub])
					.fix(() => void (storage[sub] = {}))
					.map(() => void (storage[sub][jti] = token))
					.chain(() => writeFile0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
			setTokenRecord: (sub, record) =>
				Oath.empty()
					.map(() => void (storage[sub] = record))
					.chain(() => writeFile0(path, JSON.stringify(storage), "utf-8"))
					.map(() => "OK"),
		}
	},
}
