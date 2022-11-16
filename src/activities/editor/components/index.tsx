import { useTranslation } from "react-i18next"

export default function Editor() {
  const { t } = useTranslation()

  return (
    <div
      contentEditable={true}
      suppressContentEditableWarning={true}
    >
      {t("@ordo-activity-editor/no-file")}
    </div>
  )
}
