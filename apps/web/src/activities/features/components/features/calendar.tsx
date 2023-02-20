import { ComingSoonBadge } from "@ordo-pink/react-components"
import { useTranslation } from "react-i18next"

export default function CalendarFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/calendar-title")
  const translatedText = t("@ordo-activity-features/calendar-text")
  const translatedComingSoon = t("@ordo-activity-features/coming-soon")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <div className="max-w-md">{translatedText}</div>

      <ComingSoonBadge>{translatedComingSoon}</ComingSoonBadge>
    </div>
  )
}
