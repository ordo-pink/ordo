/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Core } from "@ordo-pink/sdk-core"
import type { I18n } from "@ordo-pink/oss-i18n"

import type { ClientSDK } from "./sdk-client.types"
import type { Aist } from "@ordo-pink/oss-aist"

declare global {
	interface cmd {
		activity: {
			register: { args: ClientSDK.Activity.Instance }
			unregister: { args: ClientSDK.Activity.ID }
		}
		background_status: {
			saving: { args: void }
			loading: { args: void }
			none: { args: void }
		}
		command_palette: {
			add: { args: ClientSDK.CommandPalette.Item.Instance<() => void> }
			hide: { args: void }
			remove: { args: string | number }
			show: { args: ClientSDK.CommandPalette.Instance | undefined }
			toggle: { args: void }
		}
		i18n: {
			add_translations: {
				args: {
					locale: I18n.ISO_639_1_Locale
					values: Partial<Record<I18n.DefinitionToTranslationKeys<ClientSDK.Translations.Keys>, string>>
				}
			}
			remove_translations: { args: ClientSDK.Translations.Key[] }
			set_locale: { args: I18n.ISO_639_1_Locale }
		}
		modal: {
			hide: { args: void }
			show: { args: ClientSDK.Modal.Params }
		}
		notifications: {
			hide: { args: Core.Uuid.Instance }
			show: { args: ClientSDK.Notification.ShowArgs }
			rrr: { args: Core.Rrr.Instance & { message: ClientSDK.Translations.Key } }
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
			set_title: { args: ClientSDK.Translations.Key }
		}
		user: {
			show_request_code_modal: { args: void }
			show_verify_code_modal: { args: void }
			sign_out: { args: void }
			go_to_account: { args: void }
		}
	}
}
