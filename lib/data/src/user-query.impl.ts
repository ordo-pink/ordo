import { map_oath, tap_oath } from "@ordo-pink/oath"
import { O } from "@ordo-pink/option"

import { TUserQueryStatic } from "./user-query.types"

export const UserQuery: TUserQueryStatic = {
	of: (c_repo, k_repo) => ({
		get_current: c_repo.get,
		get_by_email: email =>
			k_repo
				.get()
				.pipe(map_oath(users => O.FromNullable(users.find(u => u.email === email))))
				.pipe(
					tap_oath(o => {
						if (o === O.None()) {
							// TODO: Go get remote
						}
					}),
				),
	}),
}
