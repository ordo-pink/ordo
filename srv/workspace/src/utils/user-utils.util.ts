// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { User } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"

export const UserUtils = {
	getUserName: (user: User.User) =>
		Switch.of(user)
			// .case(
			// 	u => !!u.firstName && !!u.lastName && !!u.handle,
			// 	() => `${user.firstName} ${user.lastName} (${user.handle})`,
			// )
			.case(
				u => !!u.firstName && !!u.lastName,
				() => `${user.firstName!} ${user.lastName}`,
			)
			.case(
				u => !!u.firstName,
				() => user.firstName,
			)
			// .case(
			// 	u => !!u.handle,
			// 	() => user.handle,
			// )
			.default(() => user.email),

	obfuscateEmail: (email: string): string => {
		const [localPart, domainPart] = email.split("@")

		const topLevelDomainStartIndex = domainPart.lastIndexOf(".")

		const higherLevelDomain = domainPart.slice(0, topLevelDomainStartIndex)
		const topLevelDomain = domainPart.slice(topLevelDomainStartIndex)

		const localTrimSize = localPart.length > 5 ? 4 : localPart.length > 2 ? 2 : 0
		const domainTrimSize = higherLevelDomain.length > 5 ? 4 : higherLevelDomain.length > 2 ? 2 : 0

		return localPart
			.slice(0, localTrimSize / 2)
			.concat("*".repeat(localPart.length - localTrimSize))
			.concat(localTrimSize ? localPart.slice(-localTrimSize / 2) : "")
			.concat("@")
			.concat(higherLevelDomain.slice(0, domainTrimSize / 2))
			.concat("*".repeat(higherLevelDomain.length - domainTrimSize))
			.concat(domainTrimSize ? higherLevelDomain.slice(-domainTrimSize / 2) : "")
			.concat(topLevelDomain)
	},
}
