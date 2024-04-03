import { chain0, fromNullable0, fromPromise0, map0, of0, orNothing } from "@ordo-pink/oath"
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
		void of0(template)
			.pipe(chain0(template => createDefaultRequest0(template, key)))
			.pipe(chain0(fetch0))
			.invoke(orNothing)

// --- Internal ---

const initRequestParams = (key: string) => ({ headers: { ...RS_HEADERS, [RS_APIKEY_HEADER]: key } })
const addMethod = () => ({ method: RS_SEND_HTTP_METHOD })
const addUrl = (url: string) => () => ({ url })
const addBody = (mail: any) => () => ({ body: JSON.stringify({ mail }) })

const fetch0 = ({ method, url, headers, body }: TRusenderSendRusenderRequestParams) =>
	fromPromise0(() => fetch(url, { method, headers, body }))

const createCommonRequest0 = (key: string, mail: EmailParams) =>
	fromNullable0(key)
		.pipe(map0(initRequestParams))
		.pipe(map0(extend(addMethod)))
		.pipe(map0(extend(addBody(mail))))

const createDefaultRequest0 = (mail: EmailParams, key: string) =>
	createCommonRequest0(key, mail).pipe(map0(extend(addUrl(RS_TEMPLATE_URL))))
