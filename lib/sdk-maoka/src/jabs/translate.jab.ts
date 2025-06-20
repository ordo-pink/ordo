/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { I18n } from "@ordo-pink/i18n"
import { maoka_dom } from "@ordo-pink/maoka"

import type { MaokaSDK } from "../sdk-maoka.types"
import { context } from "../sdk-maoka.impl"
import { zags_jabs } from "./zags.jab"

export const t_jab$: MaokaSDK.Jabs.T$ = ({ use }) => {
	const { i18n$ } = use(context.consume)
	use(zags_jabs.cheat$(i18n$, "values"))

	let current_locale: I18n.ISO_639_1_Locale = i18n$.select("locale")

	const handle_mount = () => {
		const divorce_locale = i18n$.cheat("locale", new_locale => {
			current_locale = new_locale
			use(maoka_dom.jabs.refresh$)
		})

		return () => {
			divorce_locale()
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))

	return (key, default_value = "") => {
		try {
			return i18n$.select(`values.${current_locale}_${key}`) ?? default_value
		} catch (_) {
			return default_value
		}
	}
}

export const translate_jab$: MaokaSDK.Jabs.Translate$ =
	key =>
	({ use }) => {
		if (!key) return (default_value = "") => default_value

		const { i18n$ } = use(context.consume)

		let current_locale: I18n.ISO_639_1_Locale = i18n$.select("locale")
		let current_value: string

		try {
			current_value = i18n$.select(`values.${current_locale}_${key}`)
		} catch (_) {
			current_value = ""
		}

		const handle_mount = () => {
			const divorce_locale = i18n$.cheat("locale", new_locale => {
				current_locale = new_locale
				use(maoka_dom.jabs.refresh$)
			})

			const divorce_key = i18n$.cheat(`values.${current_locale}_${key}` as any, new_value => {
				current_value = new_value as string
				use(maoka_dom.jabs.refresh$)
			})

			return () => {
				divorce_locale()
				divorce_key()
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))

		return (default_value = "") => current_value ?? default_value
	}
