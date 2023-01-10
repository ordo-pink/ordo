import { useTranslation } from "react-i18next"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

import "$activities/extension-store/index.css"

export default function ExtensionStore() {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-extension-store/title")

  return <Workspace>{translatedTitle}</Workspace>
}
