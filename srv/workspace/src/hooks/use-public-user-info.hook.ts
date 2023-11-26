import { UserID } from "@ordo-pink/data"
import { useEffect, useState } from "react"
import { User } from "@ordo-pink/frontend-core"
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
