// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BehaviorSubject } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type TGetTranslationsFn, type TTranslations } from "@ordo-pink/core"
import { call_once, keys_of } from "@ordo-pink/tau"

import { type TInitCtx } from "../frontend-client.types"

type TInitI18nFn = (params: Pick<TInitCtx, "logger" | "commands">) => {
	get_translations: TGetTranslationsFn
}

export const init_i18n: TInitI18nFn = call_once(({ logger, commands }) => {
	logger.debug("🟡 Initialising i18n...")

	commands.on("cmd.application.add_translations", ({ translations, lang, prefix }) => {
		const known_translations = translations$.getValue().unwrap() ?? ({} as TTranslations)
		const prefixed_translations = keys_of(translations).reduce(
			(acc, key) => ({ ...acc, [`t.${prefix}.${key}`]: translations[key] }),
			{},
		)

		if (!known_translations[lang]) known_translations[lang] = {}

		known_translations[lang] = { ...known_translations[lang], ...prefixed_translations }

		translations$.next(O.Some(known_translations))
	})

	logger.debug("🟢 Initialised i18n.")

	return { get_translations: () => translations$.asObservable() }
})

// --- Internal ---

const translations$ = new BehaviorSubject<TOption<TTranslations>>(O.None())
