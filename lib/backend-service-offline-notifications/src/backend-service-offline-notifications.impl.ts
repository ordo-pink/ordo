// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
			emailStrategy.send({
				from,
				to: { email, name },
				subject: "Кто-то вошёл в ваш аккаунт Ordo.pink",
				templateId: 9661,
				params: { ip, resetPasswordUrl: `${websiteHost}/reset-password` },
			})
		},
		sendEmailConfirmationRequestEmail: ({ email, confirmationUrl }) => {
			emailStrategy.send({
				from,
				to: { email, name: email },
				subject: "Регистрация в Ordo.pink",
				params: { confirmationUrl },
				templateId: 9463,
			})
		},
	}),
}
