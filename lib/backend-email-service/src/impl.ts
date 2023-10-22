// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { BackendEmailService, EmailRepository, TEmailService, EmailParams } from "./types"

export const backendEmailService: BackendEmailService = "backend-email-service"

export const of = (emailRepository: EmailRepository): TEmailService => ({
	emailRepository,
	onSignInFromNewIP: ({ email, ip, name }) => {
		const message: EmailParams = {
			from: { email: "hello@ordo.pink", name: "ORDO" },
			to: { email, name },
			subject: "Login from new device detected",
			text: `Someone logged in to your account from IP: ${ip}. Wasn't you?`,
		}

		emailRepository.send(message)
	},
})

export const EmailService = {
	of,
}
