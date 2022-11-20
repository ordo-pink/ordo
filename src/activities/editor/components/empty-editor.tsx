import { useTranslation } from "react-i18next"

export default function EmptyEditor() {
  const { t } = useTranslation()

  return (
    <div className="h-full w-full flex items-center justify-center">
      {t("@ordo-activity-editor/no-file")}
    </div>
  )
}
