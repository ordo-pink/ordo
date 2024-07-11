import { Result } from "@ordo-pink/result"

import { RRR } from "./metadata.errors"
import { type TMetadataRepositoryStatic } from "./metadata-repository.types"
import { map } from "rxjs"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
const einval = RRR.codes.einval(LOCATION)

export const MetadataRepository: TMetadataRepositoryStatic = {
	of: metadata$ => ({
		get: () =>
			Result.Try(() => metadata$.getValue())
				.pipe(Result.ops.chain(Result.FromNullable))
				.pipe(Result.ops.err_map(() => eagain())),

		put: metadata =>
			Result.FromNullable(metadata)
				.pipe(Result.ops.chain(() => Result.If(Array.isArray(metadata)))) // TODO: Add validations
				.pipe(Result.ops.chain(() => Result.Try(() => metadata$.next(metadata))))
				.pipe(Result.ops.err_map(() => einval(`.put: ${JSON.stringify(metadata)}`))),
		get sub() {
			let i = 0
			return metadata$.pipe(map(() => ++i))
		},
	}),
}

export const MR = MetadataRepository
