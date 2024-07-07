import { R } from "@ordo-pink/result"

import { type TMetadataRepositoryStatic } from "./metadata-repository.types"
import { RRR } from "./metadata.errors"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
const einval = RRR.codes.einval(LOCATION)

export const MetadataRepository: TMetadataRepositoryStatic = {
	of: metadata$ => ({
		get: () =>
			R.try(() => metadata$.getValue())
				.pipe(R.ops.chain(R.fromNullable))
				.pipe(R.ops.rrrMap(() => eagain(".get: Metadata[] not initialised"))),

		put: metadata =>
			R.fromNullable(metadata)
				.pipe(R.ops.chain(() => R.if(Array.isArray(metadata))))
				.pipe(R.ops.chain(() => R.try(() => metadata$.next(metadata))))
				.pipe(R.ops.rrrMap(() => einval(`.put: ${metadata as any}`))),
	}),
}
