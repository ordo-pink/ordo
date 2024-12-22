/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { type TPartner, ZAGS } from "@ordo-pink/zags"
import { call_once, keys_of } from "@ordo-pink/tau"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { frontend_app_en_translations } from "../translations/frontend-app-en.translations"
import { ordo_app_state } from "../app.state"

type TInitI18nFn = () => { translate: Ordo.I18N.TranslateFn }

export const init_i18n: TInitI18nFn = call_once(() => {
	const { logger, commands } = ordo_app_state.zags.unwrap()

	commands.on("cmd.application.set_language", lang => language$.update("current_lang", () => lang))
	commands.on("cmd.application.add_translations", ({ translations, lang }) =>
		translations$.update(lang, ts => keys_of(translations).reduce((acc, key) => ({ ...acc, [key]: translations[key] }), ts)),
	)

	const i18n_partner: TPartner<any> = (_, is_update) => is_update && translate_version$.update("version", v => v + 1)

	translations$.marry(i18n_partner)
	language$.marry(i18n_partner)

	const translate: Ordo.I18N.TranslateFn = (key, default_value = key) => {
		const language = language$.select("current_lang")
		const translations = translations$.select(language)

		return translations?.[key] ?? default_value
	}

	translate.$ = translate_version$

	commands.emit("cmd.application.add_translations", {
		lang: TwoLetterLocale.ENGLISH,
		translations: frontend_app_en_translations,
	})

	logger.debug("🟢 Initialised i18n.")

	return { translate }
})

// --- Internal ---

const translations$ = ZAGS.Of({} as Ordo.I18N.Translations)
const language$ = ZAGS.Of({ current_lang: TwoLetterLocale.ENGLISH })
const translate_version$ = ZAGS.Of({ version: 0 })
