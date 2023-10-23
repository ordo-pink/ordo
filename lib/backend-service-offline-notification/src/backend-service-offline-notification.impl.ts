// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type {
	EmailStrategy,
	TOfflineNotificationService,
	EmailParams,
} from "./backend-service-offline-notification.types"

export const OfflineNotificationService = {
	of: (emailRepository: EmailStrategy): TOfflineNotificationService => ({
		emailStrategy: emailRepository,
		sendSuccessfulSignInNotification: ({ email, ip, name }) => {
			const message: EmailParams = {
				from: { email: "hello@ordo.pink", name: "ORDO" },
				to: { email, name },
				subject: "Login from new device detected",
				text: `Someone logged in to your account from IP: ${ip}. Wasn't you?`,
			}

			emailRepository.send(message)
		},
	}),
}
