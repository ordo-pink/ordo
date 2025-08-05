/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TWJWTVerifyFn } from "./wjwt.types"
import { decode } from "./decode"

export const verify: TWJWTVerifyFn =
	({ alg, key, aud }) =>
	async token => {
		if (!token) throw new TypeError("Token not provided")
		if (typeof token !== "string") throw new TypeError("Invalid token")

		const parts = token.split(".")

		if (parts.length !== 3 || parts.some(part => !part)) throw new TypeError("Invalid token")

		const encoder = new TextEncoder()
		const data = parts.slice(0, 2).join(".")
		const signature = Buffer.from(parts[2], "base64url")

		const is_valid = await crypto.subtle.verify(alg, key, signature, encoder.encode(data))

		if (!is_valid) return false

		const { payload } = decode(token)

		if (payload.exp <= Date.now() / 1000) return false

		if (typeof aud === "string") {
			if (typeof payload.aud === "string") return aud === payload.aud
			return payload.aud.includes(aud)
		}

		if (typeof payload.aud === "string") return aud.includes(payload.aud)
		return aud.some(aud => payload.aud.includes(aud))
	}
