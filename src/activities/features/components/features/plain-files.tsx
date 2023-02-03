import { useTranslation } from "react-i18next"

export default function PlainFilesFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/plain-files-title")
  const translatedText = t("@ordo-activity-features/plain-files-text")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <div className="max-w-md">{translatedText}</div>
    </div>
  )
}
