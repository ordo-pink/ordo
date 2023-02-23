import { useWorkspace } from "@ordo-pink/react"
import { createContext } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import LanguageField from "./language-field"
import ThemeField from "./theme-field"
import { SettingsProps } from ".."

export const SettingsContext = createContext({} as SettingsProps)

export default function Settings(props: SettingsProps) {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-settings/title")

  return (
    <SettingsContext.Provider value={props}>
      <Workspace>
        <div className="w-full flex justify-center mt-20 p-4">
          <div className="w-full max-w-xl">
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
          </div>
        </div>
      </Workspace>
    </SettingsContext.Provider>
  )
}
