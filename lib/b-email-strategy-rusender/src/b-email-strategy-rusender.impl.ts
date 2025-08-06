/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { type Oath, oath } from "@ordo-pink/oss-oath"
import { core } from "@ordo-pink/sdk-core"

import * as LIB from "./b-email-strategy-rusender.constants"
import type * as Lib from "./b-email-strategy-rusender.types"

export const create: Lib.Create = (k, s) => ({
	send: (idempotencyKey, subject, html, to, from = s, previewTitle, headers, cc, bcc) =>
		oath
			.all([to_json({ idempotencyKey, mail: { bcc, cc, from, headers, html, previewTitle, subject, to } }), create_headers(k)])
			.pipe(oath.ops.chain(send_request))
			.pipe(oath.ops.map(ignore_response))
			.cata(oath.catas.to_promise()),
})

// --- Internal ---

const to_json = (x: any) => oath.try(() => JSON.stringify(x))

const ignore_response = core.fns.v

type SendRequest = (args: [string, Headers]) => Oath.Instance<Response, Error>
const send_request: SendRequest = ([body, headers]) =>
	oath.from_promise(() => fetch(LIB.URL, { method: LIB.METHOD, body, headers }))

const create_headers = (k: Lib.ApiKey) =>
	oath
		.of(new Headers())
		.pipe(oath.ops.tap(h => h.set(...LIB.CONTENT_TYPE_HEADER)))
		.pipe(oath.ops.tap(h => h.set(...create_api_key_header(k))))

const create_api_key_header = (k: Lib.ApiKey) => [LIB.X_API_KEY_HEADER_KEY, k] as const
