// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import {
	type EmailParams,
	type EmailTemplate,
} from "@ordo-pink/backend-service-offline-notifications"
import { Oath } from "@ordo-pink/oath"
import { extend } from "@ordo-pink/tau"

import {
	RUSENDER_API_KEY_HEADER,
	RUSENDER_CONTENT_TYPE_HEADER,
	RUSENDER_SEND_HTTP_METHOD,
	RUSENDER_SEND_URL,
	RUSENDER_TEMPLATE_URL,
} from "./backend-email-strategy-rusender.constants"
import {
	type TEmailStrategyRusenderStatic,
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
			void Oath.fromNullable((message as EmailTemplate).templateId)
				.map(() => ({
					from: message.from,
					to: message.to,
					subject: message.subject,
					cc: message.cc,
					bcc: message.bcc,
					headers: message.headers,
					params: (message as EmailTemplate).params,
					idTemplateMailUser: (message as EmailTemplate).templateId,
				}))
				.chain(mail => sendRusenderTemplateRequest(mail, key))
				.rejectedChain(() => sendRusenderSendRequest(message, key))
				.orNothing(),
	}),
}

/**
 * @deprecated
 * @see #274
 */
const sendRusenderTemplateRequest = (mail: TRusenderTemplateEmailRequestBody, key: string) =>
	Oath.fromNullable(key)
		.map(initRequestParams)
		.map(extend(addMethod))
		.map(extend(addUrl(RUSENDER_TEMPLATE_URL)))
		.map(extend(addBody(mail)))
		.chain(({ method, url, headers, body }) =>
			Oath.from(() => fetch(url, { method, headers, body })),
		)

const sendRusenderSendRequest = (mail: EmailParams, key: string) =>
	Oath.fromNullable(key)
		.map(initRequestParams)
		.map(extend(addMethod))
		.map(extend(addUrl(RUSENDER_SEND_URL)))
		.map(extend(addBody(mail)))
		.chain(({ method, url, headers, body }) =>
			Oath.from(() => fetch(url, { method, headers, body })),
		)

const initRequestParams = (key: string) => ({
	headers: { ...RUSENDER_CONTENT_TYPE_HEADER, [RUSENDER_API_KEY_HEADER]: key },
})
const addMethod = () => ({ method: RUSENDER_SEND_HTTP_METHOD })
const addUrl = (url: string) => () => ({ url })
const addBody = (mail: TRusenderTemplateEmailRequestBody | EmailParams) => () => ({
	body: JSON.stringify({ mail }),
})
