/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { I18n, LOCALE, create_i18n } from "@ordo-pink/oss-i18n"
import { Maoka, create } from "@ordo-pink/oss-maoka"
import { ClientSDK } from "@ordo-pink/sdk-client"

export const create_i18n_jab: (hunter: ClientSDK.Hunter) => Maoka.Jab<I18n.Stream<ClientSDK.Translations.Keys>> =
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

		use(create.dom.jabs.onmount(handle_mount))

		return i18n.$
	}
