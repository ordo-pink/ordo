import { useTranslation } from "react-i18next"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

export default function ExtensionStore() {
  const { t } = useTranslation()

  const Workspace = useWorkspace()

  return <Workspace>{t("@ordo-activity-extension-store/title")}</Workspace>
}
