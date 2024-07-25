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
export type TEmailContact = {
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
export type TNotificationHooks = {
	on_success?: () => void
	on_error?: (error: Error) => void
}

export type TEmailParams = {
	/**
	 * Email addressor.
	 */
	from: TEmailContact

	/**
	 * Email addressee.
	 */
	to: TEmailContact

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
export type TEmailStrategy = {
	send_async: (params: TEmailParams) => void

	send_sign_in: (params: TSendSignInEmailParams) => void

	send_sign_up: (params: TSendConfirmEmailParams) => void

	send_recover_password: (params: TSendRecoverPasswordEmailParams) => void

	send_password_changed: (params: TSendChangePasswordEmailParams) => void

	send_change_email: (params: TSendChangeEmailEmailParams) => void

	send_email_change_requested: (params: TSendChangeEmailEmailParams) => void

	send_email_changed: (params: TSendEmailChangedEmailParams) => void

	send_email_confirmation: (params: TSendResetPasswordEmailParams) => void
}

export type TSharedEmailParams = {
	to: TEmailContact
}

export type TSendSignInEmailParams = TSharedEmailParams & {
	ip: string
	reset_password_url?: string
}

export type TSendConfirmEmailParams = TSharedEmailParams & {
	confirmation_url: string
}

export type TSendRecoverPasswordEmailParams = TSharedEmailParams & {
	password_recovery_url: string
}

export type TSendChangePasswordEmailParams = TSharedEmailParams & {
	reset_password_url: string
}

export type TSendChangeEmailEmailParams = TSharedEmailParams & {
	old_email: string
	new_email: string
	confirmation_url: string
}

export type TSendEmailChangedEmailParams = TSharedEmailParams & {
	old_email: string
	new_email: string
	confirmation_url: string
}

export type TSendResetPasswordEmailParams = TSharedEmailParams & {
	confirmation_url: string
}

/**
 * `NotificationStrategy` provides a set of methods for notifying users via external means (e.g.
 * email, SMS, etc.).
 */
export type TNotificationService = {
	/**
	 * Direct access to `EmailStrategy`.
	 *
	 * @see TEmailStrategy
	 */
	email_strategy: TEmailStrategy

	sign_in: (params: TSendSignInEmailParams) => void

	sign_up: (params: TSendConfirmEmailParams) => void

	recover_password: (params: TSendRecoverPasswordEmailParams) => void

	change_password: (params: TSendChangePasswordEmailParams) => void

	change_email: (params: TSendChangeEmailEmailParams) => void

	email_changed: (params: TSendEmailChangedEmailParams) => void

	reset_password: (params: TSendResetPasswordEmailParams) => void
}

/**
 * `NotificationService` initialisation options.
 */
export type InitNotificationServiceOptions = {
	/**
	 * `EmailStrategy` for sending emails.
	 *
	 * @see TEmailStrategy
	 */
	email_strategy: TEmailStrategy

	/**
	 * Information about the notification sender.
	 */
	sender: Required<TEmailContact>

	support_channels: Record<string, string>

	social_links: Record<string, string>
}
