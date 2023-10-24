// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { EmailStrategy } from "@ordo-pink/backend-service-notification"

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
		send: message =>
			void fetch(url, {
				method,
				headers: getHeaders(apiKey),
				body: getBody(message),
			}),
	}),
}

// --- Internal ---

const url = "http://api.beta.rusender.ru/api/v1/external-mails/send"
const method = "POST"
const getHeaders = (key: string) => ({ "X-Api-Key": key })
const getBody = JSON.stringify
