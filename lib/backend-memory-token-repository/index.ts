// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TokenRecord, TokenRepository } from "@ordo-pink/backend-token-service"
import { Oath } from "@ordo-pink/oath"

const storage = {} as Record<string, TokenRecord>

const create = (): TokenRepository => ({
	getToken: (sub, jti) =>
		Oath.fromNullable(storage[sub])
			.chain(record => Oath.fromNullable(record[jti]))
			.fix(() => null),
	getTokenRecord: sub => Oath.fromNullable(storage[sub]).fix(() => null),
	removeToken: (sub, jti) =>
		Oath.fromNullable(storage[sub])
			.chain(record => Oath.fromNullable(record[jti]))
			.map(() => delete storage[sub][jti])
			.fix(() => null)
			.map(() => "OK"),
	removeTokenRecord: sub =>
		Oath.fromNullable(storage[sub])
			.fix(() => null)
			.map(() => delete storage[sub])
			.map(() => "OK"),
	setToken: (sub, jti, token) =>
		Oath.fromNullable(storage[sub])
			.fix(() => void (storage[sub] = {}))
			.map(() => void (storage[sub][jti] = token))
			.map(() => "OK"),
	setTokenRecord: (sub, record) =>
		Oath.empty()
			.map(() => void (storage[sub] = record))
			.map(() => "OK"),
})

export const MemoryTokenRepository = { create }
