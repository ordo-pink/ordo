// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TokenRecord, TokenRepository } from "@ordo-pink/backend-token-service"
import { createParentDirectory0, fileExists0, readFile0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

let storage = {} as Record<string, TokenRecord>

const create = async (path: string): Promise<TokenRepository> => {
	await fileExists0(path)
		.chain(exists =>
			exists
				? readFile0(path, "utf-8")
						.map(text => JSON.parse(text as string))
						.fix(() => ({}))
				: createParentDirectory0(path).chain(() => writeFile0(path, "{}", "utf-8").map(() => ({}))),
		)
		.map(strg => {
			storage = strg
		})
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
}

export const MemoryTokenRepository = { create }
