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

import { type TEmailStrategyRusenderStatic } from "./backend-email-strategy-rusender.types"
import { sendAsync } from "./impl/send-async"
import { sendTemplateAsync } from "./impl/send-template-async"

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
	create: params => {
		const sendTemplate = sendTemplateAsync(params)

		return {
			sendAsync: sendAsync(params),
			sendChangeEmailEmail: () => void 0 as any,
			sendConfirmEmail: ({ email, supportEmail, supportTelegram, confirmationUrl }) =>
				sendTemplate({
					from: params.from,
					to: { email },
					subject: "Регистрация в Ordo.pink",
					idTemplateMailUser: 9463,
					params: { confirmationUrl, supportEmail, supportTelegram },
				}),
			sendEmailChangedEmail: () => void 0 as any,
			sendPasswordChangedEmail: () => void 0 as any,
			sendRecoverPasswordEmail: () => void 0 as any,
			sendResetPasswordEmail: () => void 0 as any,
			sendSignInEmail: ({ email, name, ip, supportEmail, supportTelegram, resetPasswordUrl }) =>
				sendTemplate({
					from: params.from,
					to: { email, name },
					subject: "Кто-то вошёл в ваш аккаунт Ordo.pink",
					idTemplateMailUser: 9661,
					params: { ip, resetPasswordUrl, supportEmail, supportTelegram },
				}),
		}
	},
}
9463
