import type { Core } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oath"

export type Repository = {
	create: (
		owner: Core.Data.OwnerUser,
		data_id: Core.Data.Id,
		input: ReadableStream,
	) => Oath.Instance<number, Core.Rrr.Instance<"EIO" | "EEXIST">>
	read: (
		owner: Core.Data.OwnerUser,
		data_id: Core.Data.Id,
	) => Oath.Instance<ReadableStream, Core.Rrr.Instance<"EIO" | "ENOENT">>
	update: (
		owner: Core.Data.OwnerUser,
		data_id: Core.Data.Id,
		input: ReadableStream,
	) => Oath.Instance<number, Core.Rrr.Instance<"EIO" | "ENOENT">>
	delete: (owner: Core.Data.OwnerUser, data_id?: Core.Data.Id) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT">>
}
