import type { I18n } from "@ordo-pink/oss-i18n"
import type { Maoka } from "@ordo-pink/oss-maoka"

export const i18n_commands =
	($: I18n.Instance): Maoka.Jab =>
	({ use }) => {
		const handle_add: OrdoClient.Command.GunFor<"i18n.add_translations"> = ({ locale, values }) => $.add(locale, values)
		const handle_remove: OrdoClient.Command.GunFor<"i18n.remove_translations"> = $.remove
		const handle_set_locale: OrdoClient.Command.GunFor<"i18n.set_locale"> = $.set_locale

		use(ordo_client_maoka.jabs.handle_command("i18n.add_translations", handle_add))
		use(ordo_client_maoka.jabs.handle_command("i18n.remove_translations", handle_remove))
		use(ordo_client_maoka.jabs.handle_command("i18n.set_locale", handle_set_locale))
	}
