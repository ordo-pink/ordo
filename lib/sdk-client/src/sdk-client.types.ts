/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Aist } from "@ordo-pink/oss-aist"
import type { I18n } from "@ordo-pink/oss-i18n"

declare global {
	interface cmd {
		"@ordo/main": {
			activity: {
				add: { args: OrdoClient.Activity.Instance; description?: string }
				delete: { args: OrdoClient.Activity.ID }
			}
			background_status: {
				saving: { args: void }
				loading: { args: void }
				reset: { args: void }
			}
			command_palette: {
				add: { args: OrdoClient.CommandPalette.Item<() => void> }
				hide: { args: void }
				delete: { args: string | number }
				show: { args: OrdoClient.CommandPalette.Instance | undefined }
				toggle: { args: void }
			}
			content: {
				upload: { args: { name: Ordo.Data.Name; parent: Ordo.Data.Parent; content: FormData; vault_id?: Ordo.Data.VaultId } }
				set: { args: { id: Ordo.Data.Id; content: Blob; vault_id?: Ordo.Data.VaultId } }
			}
			data: {
				show_create_modal: { args: { parent: Ordo.Data.Parent; vault_id?: Ordo.Data.VaultId; on_created?: () => void } }
				show_move_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
				show_rename_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
				show_labels_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
				show_links_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId } }
				show_delete_modal: { args: { id: Ordo.Data.Id; vault_id?: Ordo.Data.VaultId; on_deleted?: () => void } }
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
			f: {
				disable: { args: { f: Ordo.F.Instance } }
				enable: { args: { f: Ordo.F.Instance } }
				delete: { args: { f: Ordo.F.Instance } }
			}
			file_association: {
				add: { args: OrdoClient.FileAssociation.Instance }
				delete: { args: OrdoClient.FileAssociation.Id }
			}
			modal: {
				hide: { args: void }
				show: { args: OrdoClient.Modal.Instance }
			}
			notification: {
				hide: { args: Ordo.Uuid.Instance }
				show: { args: OrdoClient.Notification.ShowArgs }
				rrr: { args: Ordo.Rrr.Instance }
			}
			router: {
				set_hash: { args: Aist.Hash }
				set_href: { args: string }
				set_pathname: { args: Aist.Pathname }
				set_search: { args: Aist.Search | Record<string, string> }
			}
			sidebar: {
				enable: { args: void }
				disable: { args: void }
				show: { args: void }
				hide: { args: void }
				toggle: { args: void }
			}
			title: {
				set_title: { args: OrdoClient.Translations.Key }
			}
			i18n: {
				add: { args: { locale: I18n.ISO_639_1_Locale; values: Record<string, string> } }
				delete: { args: OrdoClient.Translations.Key[] }
				set_locale: { args: I18n.ISO_639_1_Locale }
			}
			user: {
				show_request_code_modal: { args: void }
				show_verify_code_modal: { args: void }
				sign_out: { args: void }
				go_to_account: { args: void }
			}
		}
	}

	namespace OrdoClient {}
}

export {}
