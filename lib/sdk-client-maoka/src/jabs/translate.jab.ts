/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { I18n } from "@ordo-pink/oss-i18n"
import { core } from "@ordo-pink/sdk-core"

import type * as ClientMaoka from "../sdk-client-maoka.types"
import { cheat$ } from "./zags.jab"
import { context } from "../sdk-client-maoka.impl"

export const register_translations_jab: (
	locale: I18n.ISO_639_1_Locale,
	values: Partial<Record<I18n.DefinitionToTranslationKeys<OrdoClient.Translations.Keys>, string>>,
) => Maoka.Jab =
	(locale, values) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter)
			throw new Error("Maoka context is not yet initialized. Do 'context.provide' before registering translations.")

		state.hunter.shoot("i18n.add_translations", { locale, values })

		maoka.dom.jabs.onunmount(() => void state.hunter.shoot("i18n.remove_translations", core.fns.keys_of(values)))
	}

export const t_jab$: ClientMaoka.Jabs.T$ = ({ use }) => {
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

	return (key, default_value = "") => {
		try {
			return i18n$.select(`values.${current_locale}_${key}`) ?? default_value
		} catch (_) {
			return default_value
		}
	}
}

export const translate_jab$: ClientMaoka.Jabs.Translate$ =
	key =>
	({ use }) => {
		if (!key) return default_value => default_value ?? key ?? ""

		const { i18n$ } = use(context.consume)

		let current_locale: I18n.ISO_639_1_Locale = i18n$.select("locale")
		let current_value: string | undefined

		try {
			current_value = i18n$.select(`values.${current_locale}_${key}`)
		} catch (_) {
			current_value = undefined
		}

		const handle_mount = () => {
			const divorce_locale = i18n$.cheat("locale", new_locale => {
				current_locale = new_locale
				use(maoka.dom.jabs.refresh$)
			})

			const divorce_key = i18n$.cheat(`values.${current_locale}_${key}` as any, new_value => {
				current_value = new_value as string
				use(maoka.dom.jabs.refresh$)
			})

			return () => {
				divorce_locale()
				divorce_key()
			}
		}

		use(maoka.dom.jabs.onmount(handle_mount))

		return default_value => current_value ?? default_value ?? key ?? ""
	}
