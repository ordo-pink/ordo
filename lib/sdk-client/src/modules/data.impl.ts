/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface cmd {
		data: {
			show_create_modal: { args: { parent: Ordo.Data.Parent; vault_id?: Ordo.Data.VaultId } }
			show_move_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			show_labels_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			show_links_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			show_delete_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			show_access_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			show_fields_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			create: { args: Omit<Ordo.Data.CreateParams, "author"> }
			delete: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
			rename: { args: { id: Ordo.Data.Id; name: Ordo.Data.Name; vault_id?: Ordo.Data.VaultId } }
			move: { args: { id: Ordo.Data.Id; parent: Ordo.Data.Parent; vault_id?: Ordo.Data.VaultId } }
			set_permissions: { args: { id: Ordo.Data.Id; permissions: Ordo.Data.Permissions; vault_id?: Ordo.Data.VaultId } }
			set_location: { args: { id: Ordo.Data.Id; location: Ordo.Data.Location; vault_id?: Ordo.Data.VaultId } }
			set_owner: { args: { id: Ordo.Data.Id; owner: Ordo.Data.OwnerUserId; vault_id?: Ordo.Data.VaultId } }
			set_group: { args: { id: Ordo.Data.Id; group: Ordo.Data.OwnerGroupId; vault_id?: Ordo.Data.VaultId } }
			fields: {
				set: { args: { id: Ordo.Data.Id; key: string; value: any; vault_id?: Ordo.Data.VaultId } }
				delete: { args: { id: Ordo.Data.Id; key: string; vault_id?: Ordo.Data.VaultId } }
			}
			labels: {
				add: { args: { id: Ordo.Data.Id; labels: Ordo.Data.Label[]; vault_id?: Ordo.Data.VaultId } }
				delete: { args: { id: Ordo.Data.Id; labels: Ordo.Data.Label[]; vault_id?: Ordo.Data.VaultId } }
			}
			links: {
				add: { args: { id: Ordo.Data.Id; links: Ordo.Data.Link[]; vault_id?: Ordo.Data.VaultId } }
				delete: { args: { id: Ordo.Data.Id; links: Ordo.Data.Link[]; vault_id?: Ordo.Data.VaultId } }
			}
		}
	}

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
