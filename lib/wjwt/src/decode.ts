/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TWJWTDecodeFn } from "./wjwt.types"

export const decode: TWJWTDecodeFn = token => {
	if (!token) throw new TypeError("Token not provided")
	if (typeof token !== "string") throw new TypeError("Invalid token")

	const parts = token.split(".")

	if (parts.length !== 3 || parts.some(part => !part)) throw new TypeError("Invalid token")

	const [header, payload, signature] = parts.map(part => Buffer.from(part, "base64url").toString("utf-8"))

	return {
		header: JSON.parse(header),
		payload: JSON.parse(payload),
		signature: new Uint8Array(Buffer.from(signature)),
	}
}
