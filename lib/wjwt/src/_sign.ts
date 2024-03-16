// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"

import { Rrr } from "./wjwt.constants"
import { WJWTSignFn } from "./wjwt.types"

const encoder = new TextEncoder()

export const sign0: WJWTSignFn =
	({ alg, key }) =>
	payload =>
		Oath.try(() => ({
			header: JSON.stringify({ alg: getAlgorithmString(alg), typ: "JWT" }),
			payload: JSON.stringify(payload),
		}))
			.rejectedMap(() => Rrr.INVALORDO_ID_PAYLOAD)
			.chain(({ header, payload }) =>
				Oath.all({
					header: Buffer.from(encoder.encode(header)).toString("base64url"),
					payload: Buffer.from(encoder.encode(payload)).toString("base64url"),
				}).chain(({ header, payload }) =>
					Oath.try(() => crypto.subtle.sign(alg, key, encoder.encode(`${header}.${payload}`)))
						.rejectedMap(() => Rrr.ALG_KEY_MISMATCH)
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
