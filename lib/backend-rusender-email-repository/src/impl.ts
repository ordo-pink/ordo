// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { EmailRepository } from "@ordo-pink/backend-email-service"
import type { BackendRusenderEmailRepository } from "./types"

export const backendRusenderEmailRepository: BackendRusenderEmailRepository =
	"backend-rusender-email-repository"

const url = "http://api.beta.rusender.ru/api/v1/external-mails/send"

const of = (apikey: string): EmailRepository => ({
	send: message => {
		fetch(url, {
			credentials: "include",
			headers: { "X-Api-Key": apikey },
			body: JSON.stringify(message),
			method: "POST",
		})
	},
})

export const RusenderEmailRepository = { of }
