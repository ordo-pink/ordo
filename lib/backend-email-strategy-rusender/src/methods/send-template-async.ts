/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { chain_oath, from_nullable_oath, from_promise_oath, map_oath, of_oath, or_nothing_oath } from "@ordo-pink/oath"
import { type TEmailParams } from "@ordo-pink/backend-service-offline-notifications"
import { extend } from "@ordo-pink/tau"

import {
	RS_APIKEY_HEADER,
	RS_HEADERS,
	RS_SEND_HTTP_METHOD,
	RS_TEMPLATE_URL,
} from "../backend-email-strategy-rusender.constants"
import {
	TEmailStrategyRusenderParams,
	type TRusenderEmailTemplate,
	type TRusenderSendRusenderRequestParams,
} from "../backend-email-strategy-rusender.types"

export const sendTemplateAsync =
	({ key }: TEmailStrategyRusenderParams) =>
	(template: TRusenderEmailTemplate) =>
		void of_oath(template)
			.pipe(chain_oath(template => createDefaultRequest0(template, key)))
			.pipe(chain_oath(fetch0))
			.invoke(or_nothing_oath)

// --- Internal ---

const initRequestParams = (key: string) => ({ headers: { ...RS_HEADERS, [RS_APIKEY_HEADER]: key } })
const addMethod = () => ({ method: RS_SEND_HTTP_METHOD })
const addUrl = (url: string) => () => ({ url })
const addBody = (mail: any) => () => ({ body: JSON.stringify({ mail }) })

const fetch0 = ({ method, url, headers, body }: TRusenderSendRusenderRequestParams) =>
	from_promise_oath(() => fetch(url, { method, headers, body }))

const createCommonRequest0 = (key: string, mail: TEmailParams) =>
	from_nullable_oath(key)
		.pipe(map_oath(initRequestParams))
		.pipe(map_oath(extend(addMethod)))
		.pipe(map_oath(extend(addBody(mail))))

const createDefaultRequest0 = (mail: TEmailParams, key: string) =>
	createCommonRequest0(key, mail).pipe(map_oath(extend(addUrl(RS_TEMPLATE_URL))))
