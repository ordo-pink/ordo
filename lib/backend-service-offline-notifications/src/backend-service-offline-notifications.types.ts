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
 * Email head.
 */
export type EmailHead = {
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

/**
 * Email body.
 */
export type EmailBody =
	| {
			/**
			 * HTML body. Either HTML body or text body must be provided for an email to be sent.
			 */
			html?: string

			/**
			 * Text body. Either HTML body or text body must be provided for an email to be sent.
			 */
			text: string
	  }
	| {
			/**
			 * HTML body. Either HTML body or text body must be provided for an email to be sent.
			 */
			html: string

			/**
			 * Text body. Either HTML body or text body must be provided for an email to be sent.
			 */
			text?: string
	  }

/**
 * @deprecated
 */
export type EmailTemplate = {
	templateId: number
	idTemplateMailUser?: number
	params: Record<string, string>
}

export type EmailParams = EmailHead & (EmailBody | EmailTemplate)

/**
 * `EmailStrategy` provides a `send` method used by the `OfflineNotificationService` to send emails
 * to users.
 */
export type EmailStrategy = {
	/**
	 * Send provided email.
	 *
	 * @param params Message to be sent.
	 * @returns void.
	 */
	sendAsync: (params: EmailParams) => void
}

export type SendSignInNotificationParams = EmailContact & {
	/**
	 * The IP address from which the sign in happened.
	 */
	ip: string
}

export type SendEmailConfirmationRequestEmailParams = {
	/**
	 * The email to send confirmation to.
	 */
	email: string

	/**
	 * URL for validating the email.
	 */
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

	/**
	 * Send notification to the user when there is a successful sign-in to their account.
	 *
	 * @param params User info needed for creating a sign-in notification.
	 * @returns void
	 */
	sendSignInNotification: (params: SendSignInNotificationParams) => void

	/**
	 * Send a confirmation email to the user who subscribes to the email list.
	 *
	 * @param params User info needed for creating a subscription confirmation notification.
	 * @returns void
	 */
	sendEmailConfirmationRequestEmail: (params: SendEmailConfirmationRequestEmailParams) => void
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
	sender: EmailContact

	/**
	 * Ordo.pink website host for creating links in email templates.
	 */
	websiteHost: string
}
