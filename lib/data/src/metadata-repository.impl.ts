import { map } from "rxjs"

import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import {
	type TMetadataRepositoryStatic,
	type TRemoteMetadataRepositoryStatic,
} from "./metadata-repository.types"
import { RRR } from "./metadata.errors"

const LOCATION = "MetadataRepository"

const eagain = RRR.codes.eagain(LOCATION)
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
			return metadata$.pipe(map(() => i++))
		},
	}),
}

export const MR = MetadataRepository

export const RemoteMetadataRepository: TRemoteMetadataRepositoryStatic = {
	of: (data_host, fetch) => ({
		get: token =>
			Oath.Try(() => fetch(`${data_host}`, { headers: { Authorization: `Bearer ${token}` } }))
				.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
				.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
				.pipe(Oath.ops.rejected_map(error => eio(error))),
		put: () => Oath.Reject(eio("TODO: UNIMPLEMENTED")),
	}),
}
