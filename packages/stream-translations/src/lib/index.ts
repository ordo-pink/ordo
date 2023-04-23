import { LanguageResource, Bundle } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { of } from "ramda"
import { initReactI18next } from "react-i18next"
import { Subject, switchMap } from "rxjs"

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
  Object.keys(bundle).map((language) =>
    translations$.next({
      language,
      ns: extensionName,
      resources: (bundle as Record<string, string>)[language],
    } as unknown as LanguageResource),
  )
}

export const translate = (extensionName: string) => (key: string) =>
  i18next.t(key, { ns: extensionName })
