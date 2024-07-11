import { Oath, chain0, map0 } from "@ordo-pink/oath"

import { type TMetadataManagerStatic } from "./metadata-manager.types"

export const MetadataManager: TMetadataManagerStatic = {
	of: (l_repo, r_repo) => ({
		synchronise_state: () =>
			r_repo
				.get()
				.pipe(map0(metadata => l_repo.put(metadata)))
				.pipe(chain0(result => result.cata({ Ok: Oath.resolve, Err: Oath.reject }))),
	}),
}
