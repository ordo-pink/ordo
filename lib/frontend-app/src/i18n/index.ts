import { I18n, LOCALE, create_i18n } from "@ordo-pink/i18n"
import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { ClientSDK } from "@ordo-pink/sdk-client"

export const create_i18n_jab: (hunter: ClientSDK.Hunter) => Maoka.Jab<I18n.Zags<ClientSDK.Translations.Keys>> =
	hunter =>
	({ use }) => {
		const i18n = create_i18n<ClientSDK.Translations.Keys>(LOCALE.ENGLISH)

		const handle_mount = () => {
			const release_add_translations = hunter.track("i18n.add_translations", ({ locale, values }) => i18n.add(locale, values))
			const release_remove_translations = hunter.track("i18n.remove_translations", values => i18n.remove(values))
			const release_set_locale = hunter.track("i18n.set_locale", locale => i18n.set_locale(locale))

			return () => {
				release_add_translations()
				release_remove_translations()
				release_set_locale()
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))

		return i18n.$
	}
