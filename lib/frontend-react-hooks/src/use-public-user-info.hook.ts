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
