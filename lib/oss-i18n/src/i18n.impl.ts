/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create } from "@ordo-pink/oss-zags"

import type * as I18n from "./i18n.types"

export const create_i18n: I18n.CreateFn = (locale, values = {}) => {
	const $ = create<I18n.State>({ i18n: { locale, values } })

	return {
		$,

		add: (locale, values) =>
			$.update("i18n.values", prev_values => ({
				...prev_values,
				...Object.keys(values).reduce((acc, key) => ({ ...acc, [`${locale}_${key}`]: values[key] }), {}),
			})),

		set_locale: locale => $.update("i18n.locale", () => locale),

		remove: values =>
			$.update("i18n.values", prev_values =>
				Object.keys(prev_values).reduce(
					(acc, key) => (values.includes(key as any) ? acc : { ...acc, [key]: (prev_values as any)[key] }),
					{},
				),
			),

		translate: (key, default_value = "") => $.select(`i18n.values.${$.select("i18n.locale")}_${key}`) ?? default_value,
	}
}
