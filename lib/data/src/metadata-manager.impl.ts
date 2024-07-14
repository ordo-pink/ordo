import { combineLatestWith, map } from "rxjs"

import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"

import { type TMetadataManagerStatic } from "./metadata-manager.types"

export const MetadataManager: TMetadataManagerStatic = {
	of: (l_repo, r_repo, auth$) => ({
		start: on_state_change =>
			// TODO: Cache/offline repo
			auth$
				.pipe(map(auth_option => O.FromNullable(auth_option.unwrap()?.accessToken)))
				.pipe(combineLatestWith(l_repo.sub))
				.pipe(
					map(([token_option, iteration]) => {
						if (iteration === 0) {
							void Oath.FromNullable(token_option.unwrap())
								.pipe(Oath.ops.tap(() => on_state_change("get-remote")))
								.pipe(Oath.ops.chain(r_repo.get))
								.pipe(Oath.ops.tap(() => on_state_change("get-remote-complete")))
								.pipe(Oath.ops.map(metadata => l_repo.put(metadata)))
								.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
								.invoke(
									Oath.invokers.or_else(() => {
										// TODO: Handle errors
										on_state_change("get-remote-complete")
									}),
								)

							return
						}

						// TODO: Patch changes
						token_option.cata({
							Some: token =>
								void Oath.Resolve(l_repo.get())
									.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
									.pipe(Oath.ops.tap(() => on_state_change("put-remote")))
									.pipe(Oath.ops.chain(metadata => r_repo.put(token, metadata)))
									.invoke(
										Oath.invokers.or_else(() => {
											// TODO: Handle errors
											on_state_change("put-remote-complete")
										}),
									),
							None: noop,
						})
					}),
				),
	}),
}
