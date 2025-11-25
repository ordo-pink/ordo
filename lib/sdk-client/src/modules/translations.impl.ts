/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { I18n } from "@ordo-pink/oss-i18n"

declare global {
	namespace OrdoClient.Translations {
		export type Keys = Record<string, string>
		export type Key = string
		export type Locale = I18n.ISO_639_1_Locale
		export type Values = Record<string, string>

		type HasPrefix<T extends string, P extends string> = T extends `${P}${string}` ? T : never

		export type PickValues<$Prefix extends string> = {
			[_Key in keyof Values as HasPrefix<_Key, $Prefix>]: Values[_Key]
		}
	}
}
