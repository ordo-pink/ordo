import type { Hunt } from "@ordo-pink/hunt"
import type { I18n } from "@ordo-pink/i18n"
import type { Logger } from "@ordo-pink/logger"
import type { RoutaryBrowser } from "@ordo-pink/routary-browser"

declare global {
	interface t {}
	interface cmd {
		auth: {
			show_request_code_modal: { args: void }
			show_verify_code_modal: { args: void }
			sign_out: { args: void }
		}
		command_palette: {
			add: { args: Ordo.CommandPalette.Item<() => void> }
			hide: { args: void }
			remove: { args: string | number }
			show: { args: Ordo.CommandPalette.Instance | undefined }
			toggle: { args: void }
		}
		i18n: {
			add_translations: {
				args: {
					locale: I18n.ISO_639_1_Locale
					values: Partial<Record<I18n.DefinitionToTranslationKeys<Pick<t, keyof t>>, string>>
				}
			}
			set_locale: { args: I18n.ISO_639_1_Locale }
		}
		modal: {
			hide: { args: void }
			show: { args: Ordo.Modal.Params }
		}
		router: {
			set_hash: { args: string }
			set_href: { args: string }
			set_pathname: { args: string }
			set_search: { args: string | Record<string, string> }
		}
	}
}

export namespace ClientSDK {
	export type Fetch = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>

	export type Preys = Pick<cmd, keyof cmd>

	export type Hunter = Hunt.Instance<ClientSDK.Preys>

	/**
	 * Ordo backend hostnames.
	 */
	export type Hosts = {
		/**
		 * AU is Ordo authentication server.
		 *
		 * @constant - Should never be overriden. If you want a fully self-hosted instance, reach out our
		 * enter_price team for help at {@link "hello@ordo.pink"}.
		 */
		au: string

		/**
		 * FN is Ordo FStore.
		 *
		 * @constant - Should never be overriden to avoid big trouble. If you want custom Fs that do not reside in
		 * the FStore, use sideloading.
		 */
		fn: string

		/**
		 * ID provides access to user info including current user info, access to public ifo about other users,
		 * access permissions and user groups (for teams/enter_price).
		 *
		 * @constant - Should never be overriden. If you want a fully self-hosted instance, reach out our
		 * enter_price team for help at {@link "hello@ordo.pink"}.
		 */
		id: string

		/**
		 * DT is global data backup instance. Additional backup hosts are stored on the user entity.
		 *
		 * @constant - Should never be overriden. If you want to enable backup self-hosting, you should go to
		 * backup persistence section of your account settings. Global backups can be disabled there as well.
		 */
		dt: string

		/**
		 * PB provides access to publicly shared files via readable URLs.
		 *
		 * @variable - Should be replaced if you self-host public sharing.
		 */
		pb: string

		/**
		 * WEB host where the app is currently served.
		 *
		 * @variable - Should be replaced if you self-host the client app.
		 */
		web: string
	}

	// Press it, you
	export namespace F {
		export type State = {
			fetch: ClientSDK.Fetch
			hosts: ClientSDK.Hosts
			hunter: Ordo.Hunter
			i18n$: I18n.Instance<Pick<t, keyof t>>["$"]
			logger: Logger
			rotor$: RoutaryBrowser.Instance["$"]
		}
	}

	export namespace Translations {
		export type Key = I18n.DefinitionToTranslationKeys<Pick<t, keyof t>>
	}
}
