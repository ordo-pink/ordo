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

import { EmailStrategy, EmailTemplate } from "@ordo-pink/backend-service-offline-notifications"
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

			void fetch(isTemplateEmail ? templateUrl : url, {
				method,
				headers: getHeaders(apiKey),
				body: JSON.stringify({ mail }),
			})
		},
	}),
}

// --- Internal ---

const templateUrl = "https://api.beta.rusender.ru/api/v1/external-mails/send-by-template"
const url = "https://api.beta.rusender.ru/api/v1/external-mails/send"
const method = "POST"
const getHeaders = (key: string) => ({ "X-Api-Key": key, "Content-Type": "application/json" })
