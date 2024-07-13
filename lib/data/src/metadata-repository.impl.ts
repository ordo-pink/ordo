import { map } from "rxjs"

import { Result } from "@ordo-pink/result"
import { Oath, reject_oath } from "@ordo-pink/oath"

import {
	type TMetadataRepositoryStatic,
	type TRemoteMetadataRepositoryStatic,
} from "./metadata-repository.types"
import { RRR } from "./metadata.errors"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const eio = RRR.codes.eio(LOCATION)

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

export const RemoteMetadataRepository: TRemoteMetadataRepositoryStatic = {
	of: (auth$, dtHost) => ({
		get: () => Oath.Resolve("OK") as any,
		// Oath.FromNullable(auth$.getValue())
		// .pipe(
		// 	Oath.ops.chain(auth =>
		// 		Oath.Try(() =>
		// 			fetch(`${dtHost}`, {
		// 				headers: { Authorization: `Bearer ${auth.accessToken}` },
		// 			}).then(res => res.json()),
		// 		),
		// 	),
		// )
		// .pipe(
		// 	chain0(body =>
		// 		body.success
		// 			? resolve0(body.result as TMetadataDTO[])
		// 			: reject_oath(body.error as string),
		// 	),
		// )
		// .pipe(Oath.ops.rejected_map(() => enoent(".fetchRemoteState"))),
		put: () => reject_oath(eio("TODO: UNIMPLEMENTED")),
	}),
}
