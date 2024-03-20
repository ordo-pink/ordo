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

import {
	type EmailParams,
	type EmailTemplate,
} from "@ordo-pink/backend-service-offline-notifications"
import { bichain0 } from "@ordo-pink/oath/operators/bichain"
import { extend } from "@ordo-pink/tau"
import { fromNullable0 } from "@ordo-pink/oath/constructors/from-nullable"
import { fromPromise0 } from "@ordo-pink/oath/constructors/from-promise"
import { map0 } from "@ordo-pink/oath/operators/map"
import { orNothing } from "@ordo-pink/oath/runners/or-nothing"

import {
	RS_APIKEY_HEADER,
	RS_HEADERS,
	RS_SEND_HTTP_METHOD,
	RS_SEND_URL,
	RS_TEMPLATE_URL,
} from "./backend-email-strategy-rusender.constants"
import {
	type TEmailStrategyRusenderStatic,
	type TRusenderSendRusenderRequestParams,
	type TRusenderTemplateEmailRequestBody,
} from "./backend-email-strategy-rusender.types"

/**
 * `RusenderEmailStrategy` implements `EmailStrategy` for sending emails using Rusender. To create
 * a `RusenderEmailStrategy`, you need to provide Rusender API key. You can get a Rusender API key
 * at beta.rusender.ru.
 *
 * @see https://rusender.ru
 * @warning This strategy is recommended for use in "ru" region only.
 *
 * @example
 * const emailStrategy = RusenderEmailStrategy.of({ key: "YOUR_RUSENDER_API_KEY" })
 * emailStrategy.send(message)
 *
 * TODO: #272 Support for `sendSync` that awaits the result.
 * TODO: #273 Support for receiving `sendAsync` result and propagating it to an optional listener.
 * TODO: #274 Drop using templates and provide markup directly.
 * TODO: #275 Update OfflineNotificationsService types to avoid type collisions.
 */
export const EmailStrategyRusender: TEmailStrategyRusenderStatic = {
	create: ({ key }) => ({
		sendAsync: message =>
			void fromNullable0((message as EmailTemplate).templateId)
				.pipe(map0(createTemplateEmailParams(message)))
				.pipe(bichain0(() => createDefaultRequest0(message, key), createTemplateRequest0(key)))
				.pipe(bichain0(fetch0, fetch0))
				.run(orNothing),
	}),
}

// --- Internal ---

const createTemplateEmailParams = (message: EmailParams) => () => ({
	from: message.from,
	to: message.to,
	subject: message.subject,
	cc: message.cc,
	bcc: message.bcc,
	headers: message.headers,
	params: (message as EmailTemplate).params,
	idTemplateMailUser: (message as EmailTemplate).templateId,
})

const initRequestParams = (key: string) => ({ headers: { ...RS_HEADERS, [RS_APIKEY_HEADER]: key } })
const addMethod = () => ({ method: RS_SEND_HTTP_METHOD })
const addUrl = (url: string) => () => ({ url })
const addBody = (mail: any) => () => ({ body: JSON.stringify({ mail }) })

const fetch0 = ({ method, url, headers, body }: TRusenderSendRusenderRequestParams) =>
	fromPromise0(() => fetch(url, { method, headers, body }))

const createCommonRequest0 = (key: string, mail: TRusenderTemplateEmailRequestBody | EmailParams) =>
	fromNullable0(key)
		.pipe(map0(initRequestParams))
		.pipe(map0(extend(addMethod)))
		.pipe(map0(extend(addBody(mail))))

/**
 * @deprecated
 * @see #274
 */
const createTemplateRequest0 = (key: string) => (mail: TRusenderTemplateEmailRequestBody) =>
	createCommonRequest0(key, mail).pipe(map0(extend(addUrl(RS_TEMPLATE_URL))))

const createDefaultRequest0 = (mail: EmailParams, key: string) =>
	createCommonRequest0(key, mail).pipe(map0(extend(addUrl(RS_SEND_URL))))
