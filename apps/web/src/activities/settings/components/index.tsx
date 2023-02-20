import { createContext } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import LanguageField from "./language-field"
import ThemeField from "./theme-field"
import { SettingsProps } from ".."
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"

export const SettingsContext = createContext({} as SettingsProps)

export default function Settings(props: SettingsProps) {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-settings/title")

  return (
    <SettingsContext.Provider value={props}>
      <Workspace>
        <Helmet>
          <title>
            {"Ordo.pink | "}
            {translatedTitle}
          </title>
        </Helmet>
        <form className="flex flex-col space-y-4">
          <ThemeField />
          <LanguageField />
        </form>
      </Workspace>
    </SettingsContext.Provider>
  )
}
