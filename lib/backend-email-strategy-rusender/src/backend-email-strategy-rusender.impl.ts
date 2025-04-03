/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { type EmailStrategyRusender } from "./backend-email-strategy-rusender.types"

export const backend_email_strategy_rusender: EmailStrategyRusender.CreateEmailStrategyRusender = params => ({
	send: ({ content, subject, to, bcc, cc, from, headers, preview_title }) => {
		const method = "POST"

		const req_headers = new Headers()
		req_headers.set("x-api-key", params.api_key)
		req_headers.set("content-type", "application/json")

		const html = content
		const text = content

		const body = JSON.stringify({ from: from ?? params.from, to, subject, html, text, cc, bcc, headers, preview_title })

		fetch("https://api.beta.rusender.ru/api/v1/external-mails/send", { method, body, headers: req_headers }).catch(
			console.error,
		)
	},
})
