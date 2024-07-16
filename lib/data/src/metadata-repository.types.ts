import type { BehaviorSubject, Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TFetch } from "@ordo-pink/core"
import type { TResult } from "@ordo-pink/result"

import type { TMetadata, TMetadataDTO } from "./metadata.types"
import type { TRrr } from "./metadata.errors"

export type TMetadataRepository = {
	get: () => TResult<TMetadata[], TRrr<"EAGAIN">>
	put: (metadata: TMetadata[]) => TResult<void, TRrr<"EINVAL">>
	get sub(): Observable<number>
}

export type TAsyncMetadataRepository = {
	get: (token: string) => Oath<TMetadataDTO[], TRrr<"EIO">>
	put: (token: string, metadata: TMetadataDTO[]) => Oath<void, TRrr<"EINVAL" | "EIO">>
}

export type TMetadataRepositoryStatic = {
	of: (metadata$: BehaviorSubject<TMetadata[] | null>) => TMetadataRepository
}

export type TRemoteMetadataRepositoryStatic = {
	of: (data_host: string, fetch: TFetch) => TAsyncMetadataRepository
}
