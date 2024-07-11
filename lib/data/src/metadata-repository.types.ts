import type { BehaviorSubject, Observable } from "rxjs"

import { Oath } from "@ordo-pink/oath"
import type { TResult } from "@ordo-pink/result"

import type { TMetadata } from "./metadata.types"
import type { TRrr } from "./metadata.errors"

export type TMetadataRepository = {
	get: () => TResult<TMetadata[], TRrr<"EAGAIN">>
	put: (metadata: TMetadata[]) => TResult<void, TRrr<"EINVAL">>
	get sub(): Observable<number>
}

export type TAsyncMetadataRepository = {
	get: () => Oath<TMetadata[], TRrr<"EIO">>
	put: (metadata: TMetadata[]) => Oath<void, TRrr<"EINVAL" | "EIO">>
}

export type TMetadataRepositoryStatic = {
	of: (metadata$: BehaviorSubject<TMetadata[] | null>) => TMetadataRepository
}
