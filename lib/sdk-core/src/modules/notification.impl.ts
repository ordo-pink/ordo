/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace Ordo.Notification.Server.Email {
		export type Address = { name?: Ordo.User.Name; email: Ordo.User.Email }
		export type IdempotencyKey = string
		export type BlindCarbonCopies = Ordo.User.Email[]
		export type Content = string
		export type CarbonCopies = Ordo.User.Email[]
		export type From = Address
		export type Headers = Record<string, string>
		export type PreviewTitle = string
		export type Subject = string
		export type To = Address

		export type EmailArgs = [
			idemotency_key: IdempotencyKey,
			subject: Subject,
			content: Content,
			to: To,
			from?: From,
			preview_title?: PreviewTitle,
			headers?: Headers,
			cc?: CarbonCopies,
			bcc?: BlindCarbonCopies,
		]

		export type Send = (...args: EmailArgs) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO">>

		export type Strategy = {
			send: Send
			kill: () => void
		}
	}
}

export {}
