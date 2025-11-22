declare global {
	interface cmd {
		data: {
			create: { args: Omit<Ordo.Data.CreateParams, "author"> }
			delete: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.Id } }
			rename: { args: { id: Ordo.Data.Id; name: Ordo.Data.Name; vault_id?: Ordo.Data.Id } }
			move: { args: { id: Ordo.Data.Id; parent: Ordo.Data.Parent; vault_id?: Ordo.Data.Id; new_vault_id?: Ordo.Data.Id } }
			set_permissions: { args: { id: Ordo.Data.Id; permissions: Ordo.Data.Permissions; vault_id?: Ordo.Data.Id } }
			set_location: { args: { id: Ordo.Data.Id; location: Ordo.Data.Location; vault_id?: Ordo.Data.Id } }
			set_owner: { args: { id: Ordo.Data.Id; owner: Ordo.Data.OwnerUserId; vault_id?: Ordo.Data.Id } }
			set_group: { args: { id: Ordo.Data.Id; group: Ordo.Data.OwnerGroupId; vault_id?: Ordo.Data.Id } }
			fields: {
				set: { args: { id: Ordo.Data.Id; key: string; value: any; vault_id?: Ordo.Data.Id } }
				delete: { args: { id: Ordo.Data.Id; key: string; vault_id?: Ordo.Data.Id } }
			}
			labels: {
				add: { args: { id: Ordo.Data.Id; labels: Ordo.Data.Label[]; vault_id?: Ordo.Data.Id } }
				delete: { args: { id: Ordo.Data.Id; labels: Ordo.Data.Label[]; vault_id?: Ordo.Data.Id } }
			}
			links: {
				add: { args: { id: Ordo.Data.Id; links: Ordo.Data.Link[]; vault_id?: Ordo.Data.Id } }
				delete: { args: { id: Ordo.Data.Id; links: Ordo.Data.Link[]; vault_id?: Ordo.Data.Id } }
			}
		}
	}

	namespace OrdoClient.Data {
		type VaultId = Ordo.Data.Id
		type State = { data: { root: Ordo.Data.Vault; vaults: Record<VaultId, Ordo.Data.Vault> } }

		type Repository = {
			read: (id?: Ordo.Data.Id) => Oath.Instance<Ordo.Data.Vault | null, Ordo.Rrr.Instance<"EIO">>
			write: Ordo.Fns.Curried<(data: Ordo.Data.Vault, id_id?: Ordo.Data.Id) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO">>>
			kill: () => void
		}
	}
}

export {}
