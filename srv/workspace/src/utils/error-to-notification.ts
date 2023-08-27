// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Notification } from "@ordo-pink/frontend-core"

export const rrrToNotification =
	(title: string) =>
	(error: string | Error | null): Notification.Item => ({
		title,
		message: error ? (typeof error === "string" ? error : error.message) : "Unknown error",
		type: "rrr",
	})
