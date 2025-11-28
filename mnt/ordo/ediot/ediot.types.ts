declare global {
	interface cmd {
		"@ordo/ediot": {
			open: { args: void }
			open_file: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
		}
	}
}

export {}
