/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

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
