import { TwoLetterLocale, ISO_639_1_Locale } from "@ordo-pink/locale"
import { Fieldset } from "@ordo-pink/react-utils"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { SettingsContext } from "."
import { useI18n } from "../../../containers/app/hooks/use-i18n"

export default function LanguageField() {
  const i18n = useI18n()
  const { t } = useTranslation()
  const { persistedStore } = useContext(SettingsContext)

  const [language, setLanguage] = useState<ISO_639_1_Locale>(TwoLetterLocale.ENGLISH)

  useEffect(() => {
    persistedStore.get("language").then((language) => {
      setLanguage(language)
      i18n.changeLanguage(language)
    })
  }, [persistedStore, i18n])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value as ISO_639_1_Locale

    persistedStore.set("language", language)
    setLanguage(language)
    i18n.changeLanguage(language)
  }

  const translatedLanguage = t("@ordo-activity-settings/language")
  const translatedRussianLanguage = t("@ordo-activity-settings/rus-language")
  const translatedEnglishLanguage = t("@ordo-activity-settings/eng-language")

  return (
    <Fieldset>
      <div className="text-lg">{translatedLanguage}</div>

      <select
        className="px-4 py-1 rounded-lg border-0 bg-neutral-200 dark:bg-neutral-500"
        onChange={handleChange}
        value={language}
      >
        <option value={TwoLetterLocale.ENGLISH}>{translatedEnglishLanguage}</option>
        <option value={TwoLetterLocale.RUSSIAN}>{translatedRussianLanguage}</option>
      </select>
    </Fieldset>
  )
}
