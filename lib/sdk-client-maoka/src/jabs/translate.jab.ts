/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

import { context } from "../sdk-client-maoka.impl"

/**
 * @state
 * @query i18n
 */
export const translate$: Maoka.Jab<(key?: OrdoClient.Translations.Key, default_value?: string) => string> = ({ use }) => {
	const { query } = use(context.consume)
	const get_locale = use(ordo_client_maoka.jabs.cheat$(query, "i18n"))

	return (k, v) => {
		try {
			const { values, locale } = get_locale()
			return values[`${locale}_${k}`] ?? v ?? k ?? ""
		} catch (_) {
			return v ?? k ?? ""
		}
	}
}
