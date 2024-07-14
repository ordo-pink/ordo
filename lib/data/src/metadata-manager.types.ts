import type { Observable } from "rxjs"

import type { AuthResponse } from "@ordo-pink/backend-server-id"
import type { TOption } from "@ordo-pink/option"

import type { TAsyncMetadataRepository, TMetadataRepository } from "./metadata-repository.types"

export type TMetadataManagerStatic = {
	of: (
		memory_repository: TMetadataRepository,
		remote_repository: TAsyncMetadataRepository,
		auth$: Observable<TOption<AuthResponse>>,
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
