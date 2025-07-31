import type { Core } from "@ordo-pink/sdk-core"

export type EmailGuy = { name?: Core.User.Name; email: Core.User.Email }
export type IdempotencyKey = string
export type BlindCarbonCopies = Core.User.Email[]
export type Content = string
export type CarbonCopies = Core.User.Email[]
export type From = EmailGuy
export type Headers = Record<string, string>
export type PreviewTitle = string
export type Subject = string
export type To = EmailGuy

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

export type Send = (...args: EmailArgs) => Promise<void>

export type Strategy = {
	send: Send
}
