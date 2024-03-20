import type { EmailHead, EmailStrategy } from "@ordo-pink/backend-service-offline-notifications"
import type { UUIDv4 } from "@ordo-pink/tau"

import type {
	RS_APIKEY_HEADER,
	RS_HEADERS,
	RS_SEND_HTTP_METHOD,
} from "./backend-email-strategy-rusender.constants"
import type { EmailStrategyRusenderError } from "./backend-email-strategy-rusender.errors"

/**
 * Email strategy Rusender params. The only required parameter is the API key.
 */
export type TEmailStrategyRusenderParams = { key: string }

/**
 * EmailStrategyRusender static methods descriptor.
 */
export type TEmailStrategyRusenderStatic = {
	create: (params: TEmailStrategyRusenderParams) => EmailStrategy
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

export type TRusenderRequestHeaders = typeof RS_HEADERS & {
	[RS_APIKEY_HEADER]: string
}

export type TRusenderSendRusenderRequestParams = {
	method: typeof RS_SEND_HTTP_METHOD
	url: string
	body: string
	headers: TRusenderRequestHeaders
}
