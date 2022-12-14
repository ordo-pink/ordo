import { useTranslation } from "react-i18next"

import { useWorkspaceWithSidebar } from "$containers/workspace/hooks/use-workspace.hook"

export default function Settings() {
  const { t } = useTranslation()

  const Workspace = useWorkspaceWithSidebar()

  return (
    <Workspace sidebarChildren={<h1>Hello!</h1>}>{t("@ordo-activity-settings/title")}</Workspace>
  )
}
