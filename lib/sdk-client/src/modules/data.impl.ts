/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace OrdoClient.Data {
		type State = { data: { root: Ordo.Data.Vault; vaults: Record<Ordo.Data.VaultId, Ordo.Data.Vault> } }

		type Repository = {
			read: (id?: Ordo.Data.Id) => Oath.Instance<Ordo.Data.Vault | null, Ordo.Rrr.Instance<"EIO">>
			write: Ordo.Fns.Curried<(data: Ordo.Data.Vault, id_id?: Ordo.Data.Id) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO">>>
			kill: () => void
		}
	}
}

export {}
