import { ChangeEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import Fieldset from "$core/components/fieldset"
import { Language } from "$core/constants/language"

export default function LanguageField() {
  const { t } = useTranslation()
  const i18n = useI18nInit()

  const translatedLanguage = t("@ordo-activity-settings/language")
  const translatedRussianLanguage = t("@ordo-activity-settings/rus-language")
  const translatedEnglishLanguage = t("@ordo-activity-settings/eng-language")
  const [language, setLanguage] = useState(Language.ENGLISH)

  useEffect(() => {
    setLanguage(i18n.language as Language)
  }, [i18n, i18n?.language])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <Fieldset>
      <div className="text-lg">{translatedLanguage}</div>
      <select
        onChange={handleChange}
        className="px-4 py-1 rounded-lg border-0 bg-neutral-200 dark:bg-neutral-500"
        name="select"
      >
        <option
          value={Language.ENGLISH}
          selected={language === Language.ENGLISH}
        >
          {translatedEnglishLanguage}
        </option>
        <option
          value={Language.RUSSIAN}
          selected={language === Language.RUSSIAN}
        >
          {translatedRussianLanguage}
        </option>
      </select>
    </Fieldset>
  )
}
