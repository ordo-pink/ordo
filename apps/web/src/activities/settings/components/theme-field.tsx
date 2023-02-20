import { ColourTheme } from "@ordo-pink/common-types"
import { Fieldset } from "@ordo-pink/react-components"
import { ChangeEvent } from "react"
import { useTranslation } from "react-i18next"

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
        value={ColourTheme.SYSTEM}
      >
        <option value={ColourTheme.SYSTEM}>{translatedSystemTheme}</option>
        <option value={ColourTheme.DARK}>{translatedDarkTheme}</option>
        <option value={ColourTheme.LIGHT}>{translatedLightTheme}</option>
      </select>
    </Fieldset>
  )
}
