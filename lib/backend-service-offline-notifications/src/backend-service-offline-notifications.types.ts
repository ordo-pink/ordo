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

	sendSignInEmail: (params: TSendSignInEmailParams) => void

	sendSignUpEmail: (params: TSendConfirmEmailParams) => void

	sendRecoverPasswordEmail: (params: TSendRecoverPasswordEmailParams) => void

	sendPasswordChangedEmail: (params: TSendChangePasswordEmailParams) => void

	sendChangeEmailEmail: (params: TSendChangeEmailEmailParams) => void

	sendEmailChangeRequestedEmail: (params: TSendChangeEmailEmailParams) => void

	sendEmailChangedEmail: (params: TSendEmailChangedEmailParams) => void

	sendConfirmationEmail: (params: TSendResetPasswordEmailParams) => void
}

export type TSharedEmailParams = {
	supportEmail?: string
	supportTelegram?: string
	telegramChannel?: string
	from?: Required<EmailContact>
	to: EmailContact
}

export type TSendSignInEmailParams = TSharedEmailParams & {
	ip: string
	resetPasswordUrl: string
}

export type TSendConfirmEmailParams = TSharedEmailParams & {
	confirmationUrl: string
}

export type TSendRecoverPasswordEmailParams = TSharedEmailParams & {
	passwordRecoveryUrl: string
}

export type TSendChangePasswordEmailParams = TSharedEmailParams & {
	resetPasswordUrl: string
}

export type TSendChangeEmailEmailParams = TSharedEmailParams & {
	oldEmail: string
	newEmail: string
	confirmationUrl: string
}

export type TSendEmailChangedEmailParams = TSharedEmailParams & {
	oldEmail: string
	newEmail: string
}

export type TSendResetPasswordEmailParams = TSharedEmailParams & {
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

	sendSignInNotification: (params: TSendSignInEmailParams) => void

	sendSignUpNotification: (params: TSendConfirmEmailParams) => void

	sendPasswordRecoveryNotification: (params: TSendRecoverPasswordEmailParams) => void

	sendPasswordChangeNotification: (params: TSendChangePasswordEmailParams) => void

	sendEmailChangeNotifications: (params: TSendChangeEmailEmailParams) => void

	sendEmailChangedNotification: (params: TSendEmailChangedEmailParams) => void

	sendResetPasswordNotification: (params: TSendResetPasswordEmailParams) => void
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
