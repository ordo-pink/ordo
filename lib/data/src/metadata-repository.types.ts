import type { BehaviorSubject } from "rxjs"

import type { TResult } from "@ordo-pink/result"

import type { TMetadata, TMetadataDTO, TMetadataProps } from "./metadata.types"
import type { RRR } from "./metadata.errors"
import type { UserID } from "./data.types"

export type TMetadataRepository = {
	get: () => TResult<TMetadata[], RRR.MR_EAGAIN>
	put: (metadata: TMetadata[]) => TResult<void, RRR.MR_EPERM>
}

export type TMetadataRepositoryStatic = {
	of: (metadata$: BehaviorSubject<TMetadata[] | null>) => TMetadataRepository
}

// TODO:
export type TUserQuery = {
	getCurrentUserID: () => TResult<UserID, RRR.UR_EAGAIN>
}

export type TMetadataDataMapper = {
	get metadataRepository(): TMetadataRepository
	get userRepository(): TUserQuery

	fromDTO: <_TProps_ extends TMetadataProps = TMetadataProps>(
		metadata: TMetadataDTO<_TProps_>,
	) => TMetadata<_TProps_>

	toDTO: <_TProps_ extends TMetadataProps = TMetadataProps>(
		metadata: TMetadata<_TProps_>,
	) => TMetadataDTO<_TProps_>
}
