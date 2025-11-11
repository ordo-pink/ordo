/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { I18n } from "@ordo-pink/oss-i18n"
import type { Maoka } from "@ordo-pink/oss-maoka"

import { context } from "../sdk-client-maoka.impl"

export const translate$: OrdoClientMaoka.Jabs.Translate$ = ({ use }) => {
	const { query } = use(context.consume)
	const get_locale = use(ordo_client_maoka.jabs.cheat$(query, "i18n"))

	return (k, v) => {
		try {
			const { values, locale } = get_locale()
			return values[`${locale}_${k}`] ?? v ?? k
		} catch (_) {
			return v ?? k
		}
	}
}

declare global {
	export namespace OrdoClientMaoka.Jabs {
		export type TFn = (key: OrdoClient.Translations.Key, default_value?: string) => string
		export type Translate$ = Maoka.Jab<TFn>

		export type RegisterTranslations = (locale: I18n.ISO_639_1_Locale, values: Partial<I18n.Values>) => Maoka.Jab
	}
}
