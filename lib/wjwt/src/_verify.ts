// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { WJWTVerifyFn } from "./wjwt.types"
import { Rrr } from "./wjwt.constants"
import { isString } from "@ordo-pink/tau"

export const verify0: WJWTVerifyFn =
	({ alg, key }) =>
	token =>
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
				).rejectedMap(() => Rrr.ALG_KEY_MISMATCH),
			)
