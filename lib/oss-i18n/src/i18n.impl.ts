/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create } from "@ordo-pink/oss-zags"

import type * as I18n from "./i18n.types"

export const create_i18n: I18n.CreateFn = (locale, values = {}) => {
	const $ = create<I18n.State<Record<string, string>>>({ locale, values })

	return {
		$,
		add: (locale, values) =>
			$.update("values", prev_values => ({
				...prev_values,
				...Object.keys(values).reduce((acc, key) => ({ ...acc, [`${locale}_${key}`]: (values as any)[key] }), {}),
			})),
		set_locale: locale => $.update("locale", () => locale),
		remove: values =>
			$.update("values", prev_values =>
				Object.keys(prev_values).reduce(
					(acc, key) => (values.includes(key as any) ? acc : { ...acc, [key]: (prev_values as any)[key] }),
					{},
				),
			),
		translate: (key, default_value = "") => $.select(`values.${$.select("locale")}_${key as string}`) ?? default_value,
	}
}
