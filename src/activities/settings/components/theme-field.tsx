import { ColourTheme } from "@ordo-pink/core"
import { ChangeEvent } from "react"
import { useTranslation } from "react-i18next"

import Fieldset from "$core/components/fieldset"

export default function ThemeField() {
  const { t } = useTranslation()

  const translatedTheme = t("@ordo-activity-settings/theme")
  const translatedSystemTheme = t("@ordo-activity-settings/system-theme")
  const translatedDarkTheme = t("@ordo-activity-settings/dark-theme")
  const translatedLightTheme = t("@ordo-activity-settings/light-theme")

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const body = document.getElementsByTagName("body")[0]

    if (event.target.value === ColourTheme.DARK) {
      body.classList.add("dark")
    } else {
      body.classList.remove("dark")
    }
  }

  return (
    <Fieldset>
      <div className="text-lg">{translatedTheme}</div>

      <select
        className="px-4 py-1 rounded-lg border-0 bg-neutral-200 dark:bg-neutral-500"
        name="select"
        onChange={handleChange}
      >
        <option
          value="system"
          selected
        >
          {translatedSystemTheme}
        </option>
        <option value="dark">{translatedDarkTheme}</option>
        <option value="light">{translatedLightTheme}</option>
      </select>
    </Fieldset>
  )
}
