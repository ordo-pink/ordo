import type { TAsyncMetadataRepository, TMetadataRepository } from "./metadata-repository.types"

export type TMetadataManagerStatic = {
	of: (
		memory_repository: TMetadataRepository,
		remote_repository: TAsyncMetadataRepository,
	) => TMetadataManager
}

export type TMetadataManagerStateChange =
	| "get-remote"
	| "get-remote-complete"
	| "put-remote"
	| "put-remote-complete"

export type TMetadataManager = {
	start: (on_state_change: (change: TMetadataManagerStateChange) => void) => void
}
