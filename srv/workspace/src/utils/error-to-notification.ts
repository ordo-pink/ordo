// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export const rrrToNotification =
	(title: string) =>
	(error: string | Error | null): Client.Notification.ShowNotificationParams => ({
		title,
		message: error ? (typeof error === "string" ? error : error.message) : "Unknown error",
		type: "rrr",
	})
