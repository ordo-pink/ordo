import { useTranslation } from "react-i18next"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace"

import "$activities/settings/index.css"

export default function Settings() {
  const Workspace = useWorkspaceWithSidebar()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-settings/title")

  return <Workspace sidebarChildren={<h1>TODO</h1>}>{translatedTitle}</Workspace>
}
