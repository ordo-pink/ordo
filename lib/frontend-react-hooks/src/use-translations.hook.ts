// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { O } from "@ordo-pink/option"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { use$ } from ".."

export const useTranslation = () => {
	const { get_translations } = use$.ordo_context()
	const current_language = useCurrentLanguage()

	const translations$ = get_translations()

	const translations_option = use$.strict_subscription(translations$, O.None())

	return (key: string) => {
		const translations = translations_option
			.pipe(O.ops.map(ts => ts[current_language] ?? ({} as Record<string, string>)))
			.cata({ Some: ts => ts, None: () => ({}) as Record<string, string> })

		const result = translations[key]

		return result != null ? result : key
	}
}

export const useScopedTranslation = (prefix = "common") => {
	const current_language = useCurrentLanguage()

	const { get_translations } = use$.ordo_context()
	const translations$ = get_translations()
	const translations_option = use$.strict_subscription(translations$, O.None())

	return (key: string) => {
		const translations = translations_option
			.pipe(O.ops.map(ts => ts[current_language] ?? ({} as Record<string, string>)))
			.cata({ Some: ts => ts, None: () => ({}) as Record<string, string> })

		const scoped_key = `${prefix}.${key}`

		const result = translations[scoped_key]

		return result != null ? result : scoped_key
	}
}

/**
 * TODO: Get from user settings
 */
export const useCurrentLanguage = () => TwoLetterLocale.ENGLISH
