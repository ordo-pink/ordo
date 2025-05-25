/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Zags } from "@ordo-pink/zags"

import type { LOCALE } from "./i18n.impl"

export namespace I18n {
	export type ISO_639_1_Locale = `${LOCALE}`

	export type DefinitionToTranslationKeys<
		$Record extends Record<string, unknown>,
		$Prefix extends string = "",
		$Key extends keyof $Record = keyof $Record,
	> = $Key extends string
		? $Record[$Key] extends string
			? $Prefix extends ""
				? $Key
				: `${$Prefix}_${$Key}`
			: $Record[$Key] extends Record<string, unknown>
				? DefinitionToTranslationKeys<$Record[$Key], $Prefix extends "" ? $Key : `${$Prefix}_${$Key}`, keyof $Record[$Key]>
				: never
		: never

	export type Key<$Record extends Record<string, unknown>> = DefinitionToTranslationKeys<$Record>

	export type Values<$Record extends Record<string, unknown>> = Record<`${LOCALE}_${Key<$Record>}`, string>

	export type State<$Record extends Record<string, unknown>> = { locale: ISO_639_1_Locale; values: I18n.Values<$Record> }

	export type Instance<$Record extends Record<string, unknown>> = {
		$: Zags.Instance<I18n.State<$Record>>
		add: (locale: ISO_639_1_Locale, values: Partial<Record<I18n.DefinitionToTranslationKeys<$Record>, string>>) => void
		set_locale: (locale: ISO_639_1_Locale) => void
		translate: (key: Key<$Record>, default_value?: string) => string
	}

	export type CreateFn = <$Record extends Record<string, unknown>>(
		initial_locale: ISO_639_1_Locale,
		initial_values?: Partial<I18n.Values<$Record>>,
	) => I18n.Instance<$Record>
}
