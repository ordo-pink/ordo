// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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

export type EmailTemplate = {
	templateId: number
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
	send: (params: EmailParams) => void
}

export type SendSignInNotificationParams = EmailContact & {
	/**
	 * The IP address from which the sign in happened.
	 */
	ip: string
}

export type SendSubscriptionConfirmationEmail = {
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
	sendSubscriptionConfirmationEmail: (params: SendSubscriptionConfirmationEmail) => void
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
