// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { WJWTVerifyFn } from "./wjwt.types"
import { Rrr } from "./wjwt.constants"
import { isString } from "@ordo-pink/tau"
import { decode0 } from "./_decode"

export const verify0: WJWTVerifyFn =
	({ alg, key }) =>
	(
		token,
		aud, // TODO: Check aud
	) =>
		Oath.fromNullable(token)
			.rejectedMap(() => Rrr.INVALID_TOKEN)
			.chain(token =>
				Oath.fromBoolean(
					() => isString(token),
					() => token,
					() => Rrr.INVALID_TOKEN,
				),
			)
			.map(token => token.split("."))
			.chain(parts =>
				Oath.fromBoolean(
					() => parts.length === 3 && parts.every(part => isString(part)),
					() => parts as [string, string, string],
					() => Rrr.INVALID_TOKEN,
				),
			)
			.map(([header, payload, signature]) => [`${header}.${payload}`, signature])
			.chain(([data, signature]) =>
				Oath.try(() =>
					crypto.subtle.verify(
						alg,
						key,
						Buffer.from(signature, "base64url"),
						new TextEncoder().encode(data),
					),
				)
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
