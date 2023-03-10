import { ISO_639_1_Locale } from "@ordo-pink/locale"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import * as Rx from "rxjs"

i18next.use(LanguageDetector).init({ initImmediate: false })

export type Bundle = Partial<Record<ISO_639_1_Locale, Record<string, string>>>
type LanguageResource = {
  language: ISO_639_1_Locale
  ns: string
  resources: Record<string, string>
}

const translations$ = new Rx.Subject<LanguageResource>()

export const i18n$ = translations$.pipe(
  Rx.switchMap(({ language, ns, resources }) =>
    Rx.of(i18next.addResourceBundle(language, ns, resources)),
  ),
)

i18n$.subscribe()

// API --------------------------------------------------------------------- //

export const registerTranslations = (extensionName: string) => (bundle: Bundle) => {
  Object.keys(bundle).map((language) =>
    translations$.next({
      language,
      ns: extensionName,
      resources: (bundle as Record<string, string>)[language],
    } as unknown as LanguageResource),
  )
}
