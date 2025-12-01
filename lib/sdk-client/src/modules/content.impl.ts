/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace OrdoClient.Content {
		type Instance = Blob | null

		type Repository = {
			read: (
				owner: Ordo.Data.OwnerUserId,
				data_id: Ordo.Data.Id,
			) => Oath.Instance<Instance, Ordo.Rrr.Instance<"EIO" | "ENOENT" | "EPERM">>

			write: (
				owner: Ordo.Data.OwnerUserId,
				data_id: Ordo.Data.Id,
				input: Instance,
			) => Oath.Instance<number, Ordo.Rrr.Instance<"EIO" | "ENOENT">>

			kill: () => void
		}
	}
}

export {}
