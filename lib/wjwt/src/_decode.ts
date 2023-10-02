// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { Rrr } from "./wjwt.constants"
import { WJWTDecodeFn } from "./wjwt.types"
import { isString } from "@ordo-pink/tau"

export const decode0: WJWTDecodeFn = token =>
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

		.map(parts => parts.map(part => Buffer.from(part, "base64url").toString("utf-8")))
		.chain(([header, payload, signature]) =>
			Oath.all({
				header: Oath.try(() => JSON.parse(header)).rejectedMap(() => Rrr.INVALID_TOKEN),
				payload: Oath.try(() => JSON.parse(payload)).rejectedMap(() => Rrr.INVALID_TOKEN),
				signature: new Uint8Array(Buffer.from(signature)),
			}),
		)
