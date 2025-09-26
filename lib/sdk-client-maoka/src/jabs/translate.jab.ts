/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { I18n } from "@ordo-pink/oss-i18n"
import { core } from "@ordo-pink/sdk-core"

import { cheat$ } from "./zags.jab"
import { context } from "../sdk-client-maoka.impl"

export const register_translations: OrdoClientMaoka.Jabs.RegisterTranslations =
	(locale, values) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter)
			throw new Error("Maoka context is not yet initialized. Do 'context.provide' before registering translations.")

		state.hunter.shoot("i18n.add_translations", { locale, values })

		maoka.dom.jabs.onunmount(() => void state.hunter.shoot("i18n.remove_translations", core.fns.keys_of(values)))
	}

export const t_jab$: OrdoClientMaoka.Jabs.T$ = ({ use }) => {
	const { i18n$ } = use(context.consume)
	use(cheat$(i18n$, "values"))

	let current_locale: I18n.ISO_639_1_Locale = i18n$.select("locale")

	const handle_mount = () => {
		const divorce_locale = i18n$.cheat("locale", new_locale => {
			current_locale = new_locale
			use(maoka.dom.jabs.refresh$)
		})

		return () => {
			divorce_locale()
		}
	}

	use(maoka.dom.jabs.onmount(handle_mount))

	return (k, v = "") => {
		try {
			return i18n$.select(`values.${current_locale}_${k}`) ?? v
		} catch (_) {
			return v
		}
	}
}

export const translate_jab$: OrdoClientMaoka.Jabs.Translate$ =
	k =>
	({ use }) => {
		if (!k) return v => v ?? k ?? ""

		const { i18n$ } = use(context.consume)

		let current_locale: I18n.ISO_639_1_Locale = i18n$.select("locale")
		let current_value: string | undefined

		try {
			current_value = i18n$.select(`values.${current_locale}_${k}`)
		} catch (_) {
			current_value = undefined
		}

		const handle_mount = () => {
			const divorce_locale = i18n$.cheat("locale", new_locale => {
				current_locale = new_locale
				use(maoka.dom.jabs.refresh$)
			})

			const divorce_key = i18n$.cheat(`values.${current_locale}_${k}` as any, new_value => {
				current_value = new_value as string
				use(maoka.dom.jabs.refresh$)
			})

			return () => {
				divorce_locale()
				divorce_key()
			}
		}

		use(maoka.dom.jabs.onmount(handle_mount))

		return v => current_value ?? v ?? k ?? ""
	}

declare global {
	export namespace OrdoClientMaoka.Jabs {
		export type TranslateFn = (default_value?: string) => string
		export type Translate$ = (key?: OrdoClient.Translations.Key) => Maoka.Jab<TranslateFn>

		export type TFn = (key: OrdoClient.Translations.Key, default_value?: string) => string
		export type T$ = Maoka.Jab<TFn>

		export type RegisterTranslations = (
			locale: I18n.ISO_639_1_Locale,
			values: Partial<Record<I18n.DefinitionToTranslationKeys<OrdoClient.Translations.Keys>, string>>,
		) => Maoka.Jab
	}
}
