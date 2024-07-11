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
import { is_string } from "@ordo-pink/tau"

import { Rrr } from "./wjwt.constants"
import { WJWTDecodeFn } from "./wjwt.types"

export const decode0: WJWTDecodeFn = token =>
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

		.map(parts => parts.map(part => Buffer.from(part, "base64url").toString("utf-8")))
		.chain(([header, payload, signature]) =>
			Oath.all({
				header: Oath.try(() => JSON.parse(header)).rejectedMap(() => Rrr.INVALORDO_ID_TOKEN),
				payload: Oath.try(() => JSON.parse(payload)).rejectedMap(() => Rrr.INVALORDO_ID_TOKEN),
				signature: new Uint8Array(Buffer.from(signature)),
			}),
		)
