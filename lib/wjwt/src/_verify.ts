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
import { isString } from "@ordo-pink/tau"

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
					() => isString(token),
					() => token,
					() => Rrr.INVALORDO_ID_TOKEN,
				),
			)
			.map(token => token.split("."))
			.chain(parts =>
				Oath.fromBoolean(
					() => parts.length === 3 && parts.every(part => isString(part)),
					() => parts as [string, string, string],
					() => Rrr.INVALORDO_ID_TOKEN,
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
