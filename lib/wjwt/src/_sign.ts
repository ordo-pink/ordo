// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { WJWTSignFn } from "./wjwt.types"
import { Rrr } from "./wjwt.constants"
import { Switch } from "@ordo-pink/switch"

const encoder = new TextEncoder()

export const sign0: WJWTSignFn =
	({ alg, key }) =>
	payload =>
		Oath.try(() => ({
			header: JSON.stringify({ alg: getAlgorithmString(alg), typ: "JWT" }),
			payload: JSON.stringify(payload),
		}))
			.rejectedMap(() => Rrr.INVALID_PAYLOAD)
			.chain(({ header, payload }) =>
				Oath.all({
					header: Buffer.from(encoder.encode(header)).toString("base64url"),
					payload: Buffer.from(encoder.encode(payload)).toString("base64url"),
				}).chain(({ header, payload }) =>
					Oath.try(() => crypto.subtle.sign(alg, key, encoder.encode(`${header}.${payload}`)))
						.rejectedMap(e => Rrr.ALG_KEY_MISMATCH)
						.map(buffer => [
							`${header}.${payload}`,
							Buffer.from(new Uint8Array(buffer)).toString("base64url"),
						]),
				),
			)
			.map(parts => parts.join("."))

const getAlgorithmString = (alg: Algorithm) =>
	Switch.of(alg.name)
		.case("ECDSA", () =>
			Switch.of((alg as any).namedCurve)
				.case("P-256", () => "ES256")
				.case("P-384", () => "ES384")
				.case("P-512", () => "ES512")
				.default(() => "ECDSA"),
		)
		.case("RSA-PSS", () =>
			Switch.of((alg as any).hash.name)
				.case("SHA-256", () => "RS256")
				.case("SHA-384", () => "RS384")
				.case("SHA-512", () => "RS512")
				.default(() => "RSA-PSS"),
		)
		.default(() => null)
