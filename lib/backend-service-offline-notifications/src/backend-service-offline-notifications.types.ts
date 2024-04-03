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

/**
 * From/to.
 */
export type EmailContact = {
	/**
	 * Email address.
	 */
	email: string

	/**
	 * Full name of the user associated with the email.
	 */
	name?: string
}

/**
 * @todo Implement support for hooks.
 *
 * @deprecated Not implemented!
 */
export type NotificationHooks = {
	onSuccess?: () => void
	onError?: (error: Error) => void
}

export type EmailParams = {
	/**
	 * Email addressor.
	 */
	from: EmailContact

	/**
	 * Email addressee.
	 */
	to: EmailContact

	/**
	 * Email subject.
	 */
	subject: string

	/**
	 * Carbon copy (CC) emails.
	 */
	cc?: string[]

	/**
	 * Blind carbon (BCC) copy emails.
	 */
	bcc?: string[]

	/**
	 * Email headers.
	 */
	headers?: Record<string, string>

	/**
	 * HTML body. Either HTML body or text body must be provided for an email to be sent.
	 */
	html?: string

	/**
	 * Text body. Either HTML body or text body must be provided for an email to be sent.
	 */
	text?: string
}

/**
 * `EmailStrategy` provides a `send` method used by the `OfflineNotificationService` to send emails
 * to users.
 */
export type EmailStrategy = {
	sendAsync: (params: EmailParams) => void

	sendSignInEmail: (params: SendSignInNotificationParams) => void

	sendSignUpEmail: (params: SendEmailConfirmationRequestEmailParams) => void

	sendRecoverPasswordEmail: (params: SendPasswordRecoveryNotificationParams) => void

	sendPasswordChangedEmail: (params: SendPasswordChangeNotificationParams) => void

	sendChangeEmailEmail: (params: SendEmailChangeNotificationParams) => void

	sendEmailChangeRequestedEmail: (params: SendEmailChangeNotificationParams) => void

	sendConfirmationEmail: (params: SendResetPasswordNotificationParams) => void
}

export type SendSignInNotificationParams = {
	from: Required<EmailContact>
	to: EmailContact
	ip: string
	resetPasswordUrl: string
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
}

export type SendEmailConfirmationRequestEmailParams = {
	from: Required<EmailContact>
	to: EmailContact
	confirmationUrl: string
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
}

export type SendPasswordRecoveryNotificationParams = {
	from: Required<EmailContact>
	to: EmailContact
	passwordRecoveryUrl: string
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
}

export type SendPasswordChangeNotificationParams = {
	from: Required<EmailContact>
	to: EmailContact
	resetPasswordUrl: string
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
}

export type SendEmailChangeNotificationParams = {
	from: Required<EmailContact>
	to: EmailContact
	oldEmail: string
	newEmail: string
	confirmationUrl: string
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
}

export type SendResetPasswordNotificationParams = {
	from: Required<EmailContact>
	to: EmailContact
	supportEmail: string
	supportTelegram: string
	telegramChannel: string
	confirmationUrl: string
}

/**
 * `NotificationStrategy` provides a set of methods for notifying users via external means (e.g.
 * email, SMS, etc.).
 */
export type TNotificationService = {
	/**
	 * Direct access to `EmailStrategy`.
	 *
	 * @see EmailStrategy
	 */
	emailStrategy: EmailStrategy

	sendSignInNotification: (params: SendSignInNotificationParams) => void

	sendSignUpNotification: (params: SendEmailConfirmationRequestEmailParams) => void

	sendPasswordRecoveryNotification: (params: SendPasswordRecoveryNotificationParams) => void

	sendPasswordChangeNotification: (params: SendPasswordChangeNotificationParams) => void

	sendEmailChangeNotifications: (params: SendEmailChangeNotificationParams) => void

	sendResetPasswordNotification: (params: SendResetPasswordNotificationParams) => void
}

/**
 * `NotificationService` initialisation options.
 */
export type InitNotificationServiceOptions = {
	/**
	 * `EmailStrategy` for sending emails.
	 *
	 * @see EmailStrategy
	 */
	emailStrategy: EmailStrategy

	/**
	 * Information about the notification sender.
	 */
	sender: Required<EmailContact>
}
