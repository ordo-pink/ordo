/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TAlgorithm, type TJWTHeader, type TWJWTSignFn } from "./wjwt.types"

export const sign: TWJWTSignFn =
	({ alg, key, iss, token_lifetime, aud }) =>
	async data => {
		const encoder = new TextEncoder()

		if (data.iss && data.iss !== iss) throw new TypeError(`Unexpected issuer "${data.iss}"`)
		if (!data.sub) throw new TypeError("Token subject not provided")

		if (!data.aud) data.aud = aud
		if (!data.iss) data.iss = iss
		if (!data.jti) data.jti = crypto.randomUUID()
		if (!data.iat) data.iat = Math.floor(Date.now() / 1000)
		if (!data.exp) data.exp = Math.floor(Date.now() / 1000) + token_lifetime

		const header_str = JSON.stringify({ alg: get_alg_str(alg), typ: "JWT" })
		const header = Buffer.from(encoder.encode(header_str)).toString("base64url")

		const payload_str = JSON.stringify(data)
		const payload = Buffer.from(encoder.encode(payload_str)).toString("base64url")

		const base64_data = `${header}.${payload}`

		const signature = await crypto.subtle.sign(alg, key, encoder.encode(base64_data))
		const signature_str = Buffer.from(new Uint8Array(signature)).toString("base64url")

		return {
			payload: data as any,
			token: `${base64_data}.${signature_str}`,
		}
	}

const get_alg_str = (alg: TAlgorithm): TJWTHeader["alg"] => {
	if (alg.name === "ECDSA") {
		if (alg.namedCurve === "P-256") return "ES256"
		if (alg.namedCurve === "P-384") return "ES384"
		if (alg.namedCurve === "P-512") return "ES512"

		return "ECDSA"
	}

	if (alg.name === "RSA-PSS") {
		if (alg.hash.name === "SHA-256") return "RS256"
		if (alg.hash.name === "SHA-384") return "RS384"
		if (alg.hash.name === "SHA-512") return "RS512"

		return "RSA-PSS"
	}

	throw new TypeError("Unsupported algorithm")
}
