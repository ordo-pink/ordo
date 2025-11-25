/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface cmd {
		ordo_filet: {
			open: { args: void }
			open_vault: { args: Ordo.Data.VaultId }
			open_file: { args: { id: Ordo.Data.Id; vault?: Ordo.Data.VaultId } }
		}
	}
}

export {}
