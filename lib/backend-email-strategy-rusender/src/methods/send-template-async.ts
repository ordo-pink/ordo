import {
	chain_oath,
	from_nullable_oath,
	from_promise_oath,
	map_oath,
	of_oath,
	or_nothing_oath,
} from "@ordo-pink/oath"
import { type EmailParams } from "@ordo-pink/backend-service-offline-notifications"
import { extend } from "@ordo-pink/tau"

import {
	RS_APIKEY_HEADER,
	RS_HEADERS,
	RS_SEND_HTTP_METHOD,
	RS_TEMPLATE_URL,
} from "../backend-email-strategy-rusender.constants"
import {
	TEmailStrategyRusenderParams,
	type TRusenderEmailTemplate,
	type TRusenderSendRusenderRequestParams,
} from "../backend-email-strategy-rusender.types"

export const sendTemplateAsync =
	({ key }: TEmailStrategyRusenderParams) =>
	(template: TRusenderEmailTemplate) =>
		void of_oath(template)
			.pipe(chain_oath(template => createDefaultRequest0(template, key)))
			.pipe(chain_oath(fetch0))
			.invoke(or_nothing_oath)

// --- Internal ---

const initRequestParams = (key: string) => ({ headers: { ...RS_HEADERS, [RS_APIKEY_HEADER]: key } })
const addMethod = () => ({ method: RS_SEND_HTTP_METHOD })
const addUrl = (url: string) => () => ({ url })
const addBody = (mail: any) => () => ({ body: JSON.stringify({ mail }) })

const fetch0 = ({ method, url, headers, body }: TRusenderSendRusenderRequestParams) =>
	from_promise_oath(() => fetch(url, { method, headers, body }))

const createCommonRequest0 = (key: string, mail: EmailParams) =>
	from_nullable_oath(key)
		.pipe(map_oath(initRequestParams))
		.pipe(map_oath(extend(addMethod)))
		.pipe(map_oath(extend(addBody(mail))))

const createDefaultRequest0 = (mail: EmailParams, key: string) =>
	createCommonRequest0(key, mail).pipe(map_oath(extend(addUrl(RS_TEMPLATE_URL))))
