import { ColourTheme } from "@ordo-pink/common-types"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { SettingsContext } from "."
import Fieldset from "../../../core/components/fieldset"

export default function ThemeField() {
  const { t } = useTranslation()
  const { persistedStore } = useContext(SettingsContext)

  const translatedTheme = t("@ordo-activity-settings/theme")
  const translatedSystemTheme = t("@ordo-activity-settings/system-theme")
  const translatedDarkTheme = t("@ordo-activity-settings/dark-theme")
  const translatedLightTheme = t("@ordo-activity-settings/light-theme")

  const [theme, setTheme] = useState<ColourTheme>(ColourTheme.SYSTEM)

  useEffect(() => {
    persistedStore.get("theme").then((theme) => {
      setTheme(theme)
    })
  }, [persistedStore])

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0]

    if (theme === ColourTheme.DARK) {
      body.classList.add("dark")
    } else {
      body.classList.remove("dark")
    }
  }, [theme])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as ColourTheme
    setTheme(newTheme)
    persistedStore.set("theme", newTheme)
  }

  return (
    <Fieldset>
      <div className="text-lg">{translatedTheme}</div>

      <select
        className="px-4 py-1 rounded-lg border-0 bg-neutral-200 dark:bg-neutral-500"
        name="select"
        onChange={handleChange}
        value={theme}
      >
        <option value={ColourTheme.SYSTEM}>{translatedSystemTheme}</option>
        <option value={ColourTheme.DARK}>{translatedDarkTheme}</option>
        <option value={ColourTheme.LIGHT}>{translatedLightTheme}</option>
      </select>
    </Fieldset>
  )
}
