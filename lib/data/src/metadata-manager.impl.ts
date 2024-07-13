import { Oath } from "@ordo-pink/oath"

import { type TMetadataManagerStatic } from "./metadata-manager.types"

export const MetadataManager: TMetadataManagerStatic = {
	of: (stream_repo, remote_repo) => ({
		start: on_state_change => {
			on_state_change("get-remote")

			// TODO: Compare hashes
			// TODO: Cache/offline repo
			void remote_repo
				.get()
				.pipe(Oath.ops.tap(() => on_state_change("get-remote-complete")))
				.pipe(Oath.ops.map(metadata => stream_repo.put(metadata)))
				.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
				// TODO: Handle errors
				.invoke(Oath.invokers.or_else(() => on_state_change("get-remote-complete")))

			stream_repo.sub.subscribe(iteration => {
				void Oath.If(iteration > 0)
					.pipe(Oath.ops.map(() => stream_repo.get()))
					.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: () => Oath.Reject() })))
					// TODO: Patch changes
					.pipe(Oath.ops.tap(() => on_state_change("put-remote")))
					.pipe(Oath.ops.chain(remote_repo.put))
					// TODO: Handle errors
					.invoke(Oath.invokers.or_else(() => on_state_change("put-remote-complete")))
			})
		},
	}),
}
