import { R } from "@ordo-pink/result"

import { TMetadataRepositoryStatic } from "./metadata-repository.types"
import { composeRrrThunk } from "./metadata.errors"

const toRrr = composeRrrThunk("MetadataRepository")

export const MetadataRepository: TMetadataRepositoryStatic = {
	of: metadata$ => ({
		get: () =>
			R.try(() => metadata$.getValue())
				.pipe(R.ops.chain(R.fromNullable))
				.pipe(R.ops.rrrMap(toRrr("EAGAIN", ".get Metadata[] not initialised"))),
		put: metadata =>
			R.fromNullable(metadata)
				.pipe(R.ops.chain(() => R.if(Array.isArray(metadata))))
				.pipe(R.ops.chain(() => R.try(() => metadata$.next(metadata))))
				.pipe(R.ops.rrrMap(toRrr("EINVAL", `.put expected Metadata[], got ${metadata as any}`))),
	}),
}
