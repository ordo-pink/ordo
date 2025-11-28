declare global {
	namespace OrdoClient.Content {
		type Repository = {
			read: (
				owner: Ordo.Data.OwnerUserId,
				data_id: Ordo.Data.Id,
			) => Oath.Instance<Blob | null, Ordo.Rrr.Instance<"EIO" | "ENOENT">>

			write: (
				owner: Ordo.Data.OwnerUserId,
				data_id: Ordo.Data.Id,
				input: Blob,
			) => Oath.Instance<number, Ordo.Rrr.Instance<"EIO" | "ENOENT">>

			kill: () => void
		}
	}
}

export {}
