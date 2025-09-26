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

import * as EMAIL_STRATEGY_RUSENDER from "./b-email-strategy-rusender.constants"
import type * as EmailStrategyRusender from "./b-email-strategy-rusender.types"

export const create: EmailStrategyRusender.Create = (k, s) => ({
	send: (idempotencyKey, subject, html, to, from = s, previewTitle, headers, cc, bcc) =>
		oath
			.all([to_json({ idempotencyKey, mail: { bcc, cc, from, headers, html, previewTitle, subject, to } }), create_headers(k)])
			.pipe(oath.ops.chain(send_request))
			.pipe(oath.ops.map(ignore_response))
			.cata(oath.catas.to_promise()),
})

// --- Internal ---

const to_json = (x: any) => oath.try_catch(() => JSON.stringify(x))

const ignore_response = () => void 0

type SendRequest = (args: [string, Headers]) => Oath.Instance<Response, Error>
const send_request: SendRequest = ([body, headers]) =>
	oath.from_promise(() => fetch(EMAIL_STRATEGY_RUSENDER.URL, { method: EMAIL_STRATEGY_RUSENDER.METHOD, body, headers }))

type CreateHeaders = (key: EmailStrategyRusender.ApiKey) => Oath.Instance<Headers>
const create_headers: CreateHeaders = k =>
	oath
		.of(new Headers())
		.pipe(oath.ops.tap(h => h.set("Content-Type", "application/json")))
		.pipe(oath.ops.tap(h => h.set(...create_api_key_header(k))))

type CreateApiKeyHeader = (
	key: EmailStrategyRusender.ApiKey,
) => [typeof EMAIL_STRATEGY_RUSENDER.X_API_KEY_HEADER_KEY, EmailStrategyRusender.ApiKey]
const create_api_key_header: CreateApiKeyHeader = k => [EMAIL_STRATEGY_RUSENDER.X_API_KEY_HEADER_KEY, k]
