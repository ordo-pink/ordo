// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import {
	EmailParams,
	EmailStrategy,
	EmailTemplate,
} from "@ordo-pink/backend-service-offline-notifications"
import { Either } from "@ordo-pink/either"

/**
 * `RusenderEmailStrategy` implements `EmailStrategy` for sending emails using Rusender. To create
 * a `RusenderEmailStrategy`, you need to provide Rusender API key. You can get a Rusender API key
 * at beta.rusender.ru.
 *
 * @see https://rusender.ru
 * @warning This strategy is recommended for use in "ru" region only.
 *
 * @example
 * const emailStrategy = RusenderEmailStrategy.of("YOUR_RUSENDER_API_KEY")
 */
export const RusenderEmailStrategy = {
	/**
	 * `RusenderEmailStrategy` factory.
	 */
	of: (apiKey: string): EmailStrategy => ({
		send: message => {
			let isTemplateEmail = false

			const mail = Either.fromNullable((message as EmailTemplate).templateId)
				.map(id => {
					isTemplateEmail = true

					return {
						from: message.from,
						to: message.to,
						subject: message.subject,
						cc: message.cc,
						bcc: message.bcc,
						headers: message.headers,
						params: (message as EmailTemplate).params,
						idTemplateMailUser: id,
					}
				})
				.fold(
					() => message,
					result => result,
				)

			fetch(isTemplateEmail ? templateUrl : url, {
				method,
				headers: getHeaders(apiKey),
				body: JSON.stringify({ mail }),
			})
				.then(res => res.json())
				.then(console.log)
		},
	}),
}

// --- Internal ---

const templateUrl = "https://api.beta.rusender.ru/api/v1/external-mails/send-by-template"
const url = "https://api.beta.rusender.ru/api/v1/external-mails/send"
const method = "POST"
const getHeaders = (key: string) => ({ "X-Api-Key": key, "Content-Type": "application/json" })
