import { useTranslation } from "react-i18next"

export default function FileNotSelected() {
  const { t } = useTranslation()

  return <div className="editor_not-selected">{t("@ordo-activity-editor/no-file")}</div>
}
