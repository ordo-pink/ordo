// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import { Subject, switchMap, of } from "rxjs"
import { ISO_639_1_Locale } from "@ordo-pink/locale/mod"
import { Unary, callOnce } from "@ordo-pink/tau/mod"

export type Bundle = Partial<Record<ISO_639_1_Locale, Record<string, string>>>

export type LanguageResource = {
	language: ISO_639_1_Locale
	ns: string
	resources: Record<string, string>
}

export type RegisterTranslationsFn = Unary<string, Unary<Bundle, void>>

i18next.use(LanguageDetector).use(initReactI18next).init({ initImmediate: false })

const translations$ = new Subject<LanguageResource>()

export const i18n$ = translations$.pipe(
	switchMap(({ language, ns, resources }) =>
		of(i18next.addResourceBundle(language, ns, resources, true)),
	),
)

export const _initI18n = callOnce(() => {
	i18n$.subscribe()
})

export const registerTranslations = (extensionName: string) => (bundle: Bundle) => {
	Object.keys(bundle).map(language =>
		translations$.next({
			language,
			ns: extensionName,
			resources: (bundle as Record<string, string>)[language],
		} as unknown as LanguageResource),
	)
}

export const translate = (extensionName: string) => (key: string) =>
	i18next.t(key, { ns: extensionName })
