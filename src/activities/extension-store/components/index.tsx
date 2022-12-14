import { useTranslation } from "react-i18next"

export default function ExtensionStore() {
  const { t } = useTranslation()

  return <div>{t("@ordo-activity-extension-store/title")}</div>
}
