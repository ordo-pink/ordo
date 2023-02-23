import { createContext } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"

import { SettingsProps } from ".."
import LanguageField from "$activities/settings/components/language-field"
import ThemeField from "$activities/settings/components/theme-field"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

import EditorPage from "$core/components/editor-page/editor-page"

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
        <EditorPage
          title={translatedTitle}
          breadcrumbsPath={`/${translatedTitle}/`}
        >
          <form className="flex flex-col space-y-4">
            <ThemeField />
            <LanguageField />
          </form>
        </EditorPage>
      </Workspace>
    </SettingsContext.Provider>
  )
}
