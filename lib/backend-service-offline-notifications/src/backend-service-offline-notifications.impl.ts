// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type {
	InitNotificationServiceOptions,
	TNotificationService,
} from "./backend-service-offline-notifications.types"

export const NotificationService = {
	of: ({
		emailStrategy,
		sender: from,
		websiteHost,
	}: InitNotificationServiceOptions): TNotificationService => ({
		emailStrategy,
		sendSignInNotification: ({ email, ip, name }) => {
			emailStrategy.sendAsync({
				from,
				to: { email, name },
				subject: "Кто-то вошёл в ваш аккаунт Ordo.pink",
				templateId: 9661,
				params: { ip, resetPasswordUrl: `${websiteHost}/reset-password` },
			})
		},
		sendEmailConfirmationRequestEmail: ({ email, confirmationUrl }) => {
			emailStrategy.sendAsync({
				from,
				to: { email, name: email },
				subject: "Регистрация в Ordo.pink",
				params: { confirmationUrl },
				templateId: 9463,
			})
		},
	}),
}
