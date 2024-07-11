import type { Oath } from "@ordo-pink/oath"

import type { TAsyncMetadataRepository, TMetadataRepository } from "./metadata-repository.types"
import type { TRrr } from "./metadata.errors"

export type TMetadataManagerStatic = {
	of: (
		memory_repository: TMetadataRepository,
		remote_repository: TAsyncMetadataRepository,
	) => TMetadataManager
}

export type TMetadataManager = {
	synchronise_state: () => Oath<void, TRrr<"EIO" | "EINVAL">>
}
