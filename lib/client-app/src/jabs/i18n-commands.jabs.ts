/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { I18n } from "@ordo-pink/oss-i18n"
import type { Maoka } from "@ordo-pink/oss-maoka"

export const i18n_commands =
	(i18n: I18n.Instance): Maoka.Jab =>
	({ use }) => {
		const handle_add: OrdoClient.Command.GunFor<"ordo_main.i18n.add_translations"> = ({ locale, values }) =>
			i18n.add(locale, values)
		const handle_remove: OrdoClient.Command.GunFor<"ordo_main.i18n.remove_translations"> = i18n.remove
		const handle_set_locale: OrdoClient.Command.GunFor<"ordo_main.i18n.set_locale"> = i18n.set_locale

		use(ordo_client_maoka.jabs.handle_command("ordo_main.i18n.add_translations", handle_add))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.i18n.remove_translations", handle_remove))
		use(ordo_client_maoka.jabs.handle_command("ordo_main.i18n.set_locale", handle_set_locale))
	}
