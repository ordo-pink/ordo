import { useTranslation } from "react-i18next"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

export default function Settings() {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-user/title")

  return <Workspace>{translatedTitle}</Workspace>
}
