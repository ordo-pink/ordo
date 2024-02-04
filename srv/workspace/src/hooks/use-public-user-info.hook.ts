// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { UserID } from "@ordo-pink/data"
import { useEffect, useState } from "react"
import { Hosts } from "$utils/hosts"
import { Oath } from "@ordo-pink/oath"

export const usePublicUserInfo = (userId?: UserID) => {
	const [user, setUser] = useState<User.PublicUser | null>(null)

	useEffect(() => {
		Oath.fromNullable(userId)
			.chain(uid =>
				Oath.try(() =>
					fetch(`${Hosts.ID}/users/${uid}`)
						.then(res => res.json())
						.then(json => setUser(json.result)),
				),
			)
			.orElse(() => setUser(null))
	}, [userId])

	return user
}
