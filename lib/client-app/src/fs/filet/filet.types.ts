declare global {
	interface cmd {
		ordo: {
			filet: {
				open: { args: void }
				open_vault: { args: Ordo.Data.VaultId }
				open_file: { args: { id: Ordo.Data.Id; vault?: Ordo.Data.VaultId } }
			}
		}
	}
}

export {}
