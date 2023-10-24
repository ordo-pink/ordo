// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type {
	EmailParams,
	InitNotificationServiceOptions,
	TNotificationService,
} from "./backend-service-offline.types"

export const NotificationService = {
	of: ({
		emailStrategy,
		sender,
		websiteHost,
	}: InitNotificationServiceOptions): TNotificationService => ({
		emailStrategy,
		sendSignInNotification: ({ email, ip, name }) => {
			const message: EmailParams = {
				from: sender,
				to: { email, name },
				subject: "A new login to your Ordo.pink account",
				text: `Someone logged in to your account from IP: ${ip}. If it wasn't you, immediately visit ${websiteHost}/reset-password to change your password and protect your data.`,
			}

			emailStrategy.send(message)
		},
	}),
}
