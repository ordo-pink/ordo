declare global {
	interface cmd {
		filet: {
			open: { args: void }
			open_vault: { args: OrdoClient.Data.VaultId }
			open_file: { args: { id: Ordo.Data.Id; vault?: OrdoClient.Data.VaultId } }
		}
	}
}

export {}
