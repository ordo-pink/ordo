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

import { BehaviorSubject, combineLatestWith, map } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { call_once, keys_of } from "@ordo-pink/tau"
import { RRR } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { type TInitCtx } from "../frontend-client.types"

type TInitI18nFn = (params: Pick<TInitCtx, "logger" | "commands" | "known_functions">) => {
	get_translations: Ordo.CreateFunction.GetTranslationsFn
	get_current_language: (fid: symbol) => Ordo.CreateFunction.GetCurrentLanguageFn
	translate: Ordo.I18N.TranslateFn
}

export const init_i18n: TInitI18nFn = call_once(({ logger, commands, known_functions }) => {
	logger.debug("🟡 Initialising i18n...")

	commands.on("cmd.application.add_translations", ({ translations, lang }) => {
		const known_translations = translations$.getValue().unwrap() ?? ({} as Ordo.I18N.Translations)
		const prefixed_translations = keys_of(translations).reduce(
			(acc, key) => ({ ...acc, [key]: translations[key] }),
			{},
		)

		if (!known_translations[lang]) known_translations[lang] = {}

		known_translations[lang] = { ...known_translations[lang], ...prefixed_translations }

		translations$.next(O.Some(known_translations))
	})

	logger.debug("🟢 Initialised i18n.")

	const translate: Ordo.I18N.TranslateFn = key =>
		translations$.getValue().cata({
			Some: translations => translations[current_language$.getValue()][key] ?? key,
			None: () => key,
		})

	translate.$ = translations$
		.pipe(combineLatestWith(current_language$))
		.pipe(map((_, index) => index))

	return {
		translate,

		get_translations: () => translations$.asObservable(),

		get_current_language: fid => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["application.current_language"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_current_language -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => current_language$.asObservable())),
	}
})

// --- Internal ---

const translations$ = new BehaviorSubject<TOption<Ordo.I18N.Translations>>(O.None())
const current_language$ = new BehaviorSubject<TwoLetterLocale>(TwoLetterLocale.ENGLISH)

const eperm = RRR.codes.eperm("init_i18n")
