// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { User } from "@ordo-pink/backend-user-service"
import { Switch } from "@ordo-pink/switch"

export const UserUtils = {
	getUserName: (user: User) =>
		Switch.of(user)
			.case(
				u => !!u.firstName && !!u.lastName && !!u.username,
				() => `${user.firstName} ${user.lastName} (${user.username})`,
			)
			.case(
				u => !!u.firstName && !!u.lastName,
				() => `${user.firstName!} ${user.lastName}`,
			)
			.case(
				u => !!u.firstName,
				() => user.firstName,
			)
			.case(
				u => !!u.username,
				() => user.username,
			)
			.default(() => user.email),
}
