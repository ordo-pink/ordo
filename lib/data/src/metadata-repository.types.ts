import type { TMetadata, TMetadataDTO, TMetadataProps } from "./metadata.types"
import type { RRR } from "./metadata.errors"
import type { UserID } from "./data.types"
import { TResult } from "@ordo-pink/result"

export type TMetadataRepository = {
	create: () => any
	get: () => any
	update: () => any
	delete: () => any
}

// TODO:
export type TUserQuery = {
	getUser: (userId: UserID) => any
	getCurrentUserID: () => TResult<UserID, RRR.USERS_NOT_LOADED>
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
