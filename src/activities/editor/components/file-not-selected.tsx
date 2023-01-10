import { useTranslation } from "react-i18next"

export default function FileNotSelected() {
  const { t } = useTranslation()

  const translatedText = t("@ordo-activity-editor/no-file")

  return <div className="editor_not-selected">{translatedText}</div>
}
