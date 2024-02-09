import { useEffect, useState } from "react"

import { Oath } from "@ordo-pink/oath"
import { type UserID } from "@ordo-pink/data"
import { useFetch } from "@ordo-pink/frontend-fetch"

import { useHosts } from "./use-hosts.hook"

export const usePublicUserInfo = (userId?: UserID) => {
	const fetch = useFetch()
	const hosts = useHosts()

	const [user, setUser] = useState<User.PublicUser | null>(null)

	useEffect(() => {
		void Oath.fromNullable(userId)
			.chain(uid =>
				Oath.try(() =>
					fetch(`${hosts.idHost}/users/${uid}`)
						.then(res => res.json())
						.then(json => setUser(json.result)),
				),
			)
			.orElse(() => setUser(null))
	}, [fetch, hosts.idHost, userId])

	return user
}
