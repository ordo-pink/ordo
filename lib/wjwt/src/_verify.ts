/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 *
 */

import { Oath } from "@ordo-pink/oath"
import { is_string } from "@ordo-pink/tau"

import { Rrr } from "./wjwt.constants"
import { WJWTVerifyFn } from "./wjwt.types"
import { decode0 } from "./_decode"

export const verify0: WJWTVerifyFn =
	({ alg, key }) =>
	(
		token,
		// aud, // TODO: Check aud
	) =>
		Oath.fromNullable(token)
			.rejectedMap(() => Rrr.INVALORDO_ID_TOKEN)
			.chain(token =>
				Oath.fromBoolean(
					() => is_string(token),
					() => token,
					() => Rrr.INVALORDO_ID_TOKEN,
				),
			)
			.map(token => token.split("."))
			.chain(parts =>
				Oath.fromBoolean(
					() => parts.length === 3 && parts.every(part => is_string(part)),
					() => parts as [string, string, string],
					() => Rrr.INVALORDO_ID_TOKEN,
				),
			)
			.map(([header, payload, signature]) => [`${header}.${payload}`, signature])
			.chain(([data, signature]) =>
				Oath.try(() => crypto.subtle.verify(alg, key, Buffer.from(signature, "base64url"), new TextEncoder().encode(data)))
					.rejectedMap(() => Rrr.ALG_KEY_MISMATCH)
					.chain(isValid =>
						Oath.fromBoolean(
							() => isValid,
							() => token,
							() => false,
						)
							.chain(token => decode0(token))
							.map(decoded => decoded.payload.exp > Date.now() / 1000)
							.fix(() => false),
					),
			)
