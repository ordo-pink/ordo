import { map0, tap0 } from "@ordo-pink/oath"
import { O } from "@ordo-pink/option"

import { TUserQueryStatic } from "./user-query.types"

export const UserQuery: TUserQueryStatic = {
	of: (c_repo, k_repo) => ({
		get_current: c_repo.get,
		get_by_email: email =>
			k_repo
				.get()
				.pipe(map0(users => O.FromNullable(users.find(u => u.email === email))))
				.pipe(
					tap0(o => {
						if (o === O.None()) {
							// TODO: Go get remote
						}
					}),
				),
	}),
}
