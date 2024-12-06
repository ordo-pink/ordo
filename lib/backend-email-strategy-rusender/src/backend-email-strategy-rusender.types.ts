/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TEmailParams, TEmailStrategy } from "@ordo-pink/backend-service-offline-notifications"
import type { UUIDv4 } from "@ordo-pink/tau"

import type { RS_APIKEY_HEADER, RS_HEADERS, RS_SEND_HTTP_METHOD } from "./backend-email-strategy-rusender.constants"
import type { EmailStrategyRusenderError } from "./backend-email-strategy-rusender.errors"

/**
 * Email strategy Rusender params. The only required parameter is the API key.
 */
export type TEmailStrategyRusenderParams = { key: string }

/**
 * EmailStrategyRusender static methods descriptor.
 */
export type TEmailStrategyRusenderStatic = {
	create: (params: TEmailStrategyRusenderParams) => TEmailStrategy
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

export type TEmailStrategyRusenderMethod<K extends keyof TEmailStrategy> = (
	params: TEmailStrategyRusenderParams,
) => TEmailStrategy[K]

export type TRusenderEmailTemplate = Omit<TEmailParams, "body" | "html"> & {
	idTemplateMailUser?: number
	params: Record<string, string>
}
