/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Zags } from "@ordo-pink/oss-zags"

import type { LOCALE } from "./i18n.constants"

export type ISO_639_1_Locale = `${LOCALE}`

export type Values = Record<`${ISO_639_1_Locale}_${string}`, string>

export type State = { i18n: { locale: ISO_639_1_Locale; values: Partial<Record<`${ISO_639_1_Locale}_${string}`, string>> } }

export type Stream = Zags.Instance<State>

export type Instance = {
	$: Stream
	add: (locale: ISO_639_1_Locale, values: Record<string, string>) => void
	remove: (values: string[]) => void
	set_locale: (locale: ISO_639_1_Locale) => void
	translate: (key: string, default_value?: string) => string
}

export type CreateFn = (initial_locale: ISO_639_1_Locale, initial_values?: Partial<Values>) => Instance
