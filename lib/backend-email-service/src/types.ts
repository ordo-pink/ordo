// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type BackendEmailService = "backend-email-service"

export type EmailParams = {
	to: { email: string; name: string }
	cc?: string[]
	bcc?: string[]
	subject: string
	headers?: Record<string, string>
	from: { email: string; name: string }
	html?: string
	text?: string
	onSuccess?: () => void
	onError?: (error: Error) => void
}

export type EmailRepository = {
	send: (params: EmailParams) => void
}

export type OnSignInFromNewIPParams = {
	name: string
	email: string
	ip: string
}

export type TEmailService = {
	emailRepository: EmailRepository
	onSignInFromNewIP: (params: OnSignInFromNewIPParams) => void
}
