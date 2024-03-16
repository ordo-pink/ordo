import type { EmailHead, EmailStrategy } from "@ordo-pink/backend-service-offline-notifications"
import type { UUIDv4 } from "@ordo-pink/tau"

import type { EmailStrategyRusenderError } from "./backend-email-strategy-rusender.errors"

/**
 * Email strategy Rusender params. The only required parameter is the API key.
 */
export type TEmailStrategyRusenderP = { key: string }

/**
 * EmailStrategyRusender static methods descriptor.
 */
export type TEmailStrategyRusenderStatic = {
	create: (params: TEmailStrategyRusenderP) => EmailStrategy
}

/**
 * A request object specific to Rusender template API.
 *
 * @deprecated
 * @see #274
 */
export type TRusenderTemplateEmailRequestBody = EmailHead & {
	idTemplateMailUser: number
	params: Record<string, string>
}

/**
 * Successful Rusender request response. The default status code is `201`.
 */
export type TRusenderSendEmailResponseBody = { uuid: UUIDv4 }

/**
 * Failed Rusender request response.
 */
export type TRusenderSendEmailErrorResponseBody = {
	message: string
	statusCode: EmailStrategyRusenderError
}
