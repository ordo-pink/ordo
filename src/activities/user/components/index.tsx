import { useTranslation } from "react-i18next"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

export default function Settings() {
  const { t } = useTranslation()

  const Workspace = useWorkspace()

  return <Workspace>{t("@ordo-activity-user/name")}</Workspace>
}
