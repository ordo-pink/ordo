import { R } from "@ordo-pink/result"

import { TMetadataRepositoryStatic } from "./metadata-repository.types"
import { rrrThunk } from "./metadata.errors"

export const MetadataRepository: TMetadataRepositoryStatic = {
	of: metadata$ => ({
		get: () =>
			R.try(() => metadata$.getValue())
				.pipe(R.ops.chain(R.fromNullable))
				.pipe(R.ops.rrrMap(rrrThunk("MR_EAGAIN"))),
		put: ms =>
			R.fromNullable(ms)
				.pipe(R.ops.chain(() => R.if(Array.isArray(ms))))
				.pipe(R.ops.chain(() => R.try(() => metadata$.next(ms))))
				.pipe(R.ops.rrrMap(rrrThunk("MR_EPERM"))),
	}),
}
