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
	RusenderEmailSubject,
	RusenderTemplateId,
} from "./backend-email-strategy-rusender.constants"
import { type TEmailStrategyRusenderStatic } from "./backend-email-strategy-rusender.types"
import { sendAsync } from "./methods/send-async"
import { sendTemplateAsync } from "./methods/send-template-async"

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
			send_async: sendAsync(params),
			send_change_email: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				new_email: newEmail,
				old_email: oldEmail,
				confirmation_url: confirmationUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendChangeEmailEmail,
					idTemplateMailUser: RusenderTemplateId.sendChangeEmailEmail,
					params: {
						telegramChannel,
						newEmail,
						oldEmail,
						supportEmail,
						supportTelegram,
						confirmationUrl,
					},
				}),
			send_email_change_requested: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				new_email: newEmail,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendEmailChangeRequestedEmail,
					idTemplateMailUser: RusenderTemplateId.sendEmailChangeRequestedEmail,
					params: { telegramChannel, newEmail, supportEmail, supportTelegram },
				}),
			send_password_changed: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				reset_password_url: resetPasswordUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendPasswordChangedEmail,
					idTemplateMailUser: RusenderTemplateId.sendPasswordChangedEmail,
					params: { telegramChannel, supportEmail, supportTelegram, resetPasswordUrl },
				}),
			send_recover_password: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				password_recovery_url: passwordRecoveryUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendRecoverPasswordEmail,
					idTemplateMailUser: RusenderTemplateId.sendRecoverPasswordEmail,
					params: { telegramChannel, supportEmail, supportTelegram, passwordRecoveryUrl },
				}),
			send_email_confirmation: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				confirmation_url: confirmationUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendConfirmationEmail,
					idTemplateMailUser: RusenderTemplateId.sendConfirmationEmail,
					params: { telegramChannel, supportEmail, supportTelegram, confirmationUrl },
				}),
			send_sign_up: ({
				telegramChannel,
				from,
				to,
				support_email: supportEmail,
				support_channels: supportTelegram,
				confirmation_url: confirmationUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendSignUpEmail,
					idTemplateMailUser: RusenderTemplateId.sendSignUpEmail,
					params: { telegramChannel, confirmationUrl, supportEmail, supportTelegram },
				}),
			send_sign_in: ({
				telegramChannel,
				from,
				to,
				ip,
				support_email: supportEmail,
				support_channels: supportTelegram,
				reset_password_url: resetPasswordUrl,
			}) =>
				sendTemplate({
					from,
					to,
					subject: RusenderEmailSubject.sendSignInEmail,
					idTemplateMailUser: RusenderTemplateId.sendSignInEmail,
					params: { telegramChannel, ip, resetPasswordUrl, supportEmail, supportTelegram },
				}),
		}
	},
}
