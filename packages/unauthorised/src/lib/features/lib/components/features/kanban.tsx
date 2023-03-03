import { ComingSoonBadge } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"

export default function KanbanFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/kanban-title")
  const translatedText = t("@ordo-activity-features/kanban-text")
  const translatedComingSoon = t("@ordo-activity-features/coming-soon")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <div className="max-w-md">{translatedText}</div>

      <ComingSoonBadge>{translatedComingSoon}</ComingSoonBadge>
    </div>
  )
}
