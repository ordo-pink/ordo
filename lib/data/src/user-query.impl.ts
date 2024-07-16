import { combineLatestWith, map } from "rxjs"

import { Oath, map_oath, tap_oath } from "@ordo-pink/oath"
import { O } from "@ordo-pink/option"

import { TUserQueryStatic } from "./user-query.types"

export const UserQuery: TUserQueryStatic = {
	of: (c_repo, k_repo) => ({
		get_current: c_repo.get,
		get_by_email: email =>
			k_repo
				.get()
				.pipe(Oath.ops.map(users => O.FromNullable(users.find(u => u.email === email))))
				.pipe(
					Oath.ops.tap(o => {
						if (o === O.None()) {
							// TODO: Go get remote
						}
					}),
				),
		get version$() {
			let i = 0
			return c_repo.version$.pipe(combineLatestWith(k_repo.version$)).pipe(map(() => ++i))
		},
	}),
}
