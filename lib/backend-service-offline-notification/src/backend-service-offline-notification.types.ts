// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

/**
 * From/to.
 */
export type EmailAddressee = {
	/**
	 * Email address.
	 */
	email: string

	/**
	 * Full name of the user associated with the email.
	 */
	name: string
}

/**
 * Email head.
 */
export type EmailHead = {
	/**
	 * Email addressor.
	 */
	from: EmailAddressee

	/**
	 * Email addressee.
	 */
	to: EmailAddressee

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

export type EmailParams = EmailHead & EmailBody

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

export type SendSuccessfulSignInNotificationParams = EmailAddressee & {
	/**
	 * The IP address from which the sign in happened.
	 */
	ip: string
}

export type TOfflineNotificationService = {
	emailStrategy: EmailStrategy
	sendSuccessfulSignInNotification: (params: SendSuccessfulSignInNotificationParams) => void
}
