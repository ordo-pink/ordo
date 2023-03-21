import { useTranslation } from "react-i18next"
import calendar from "../../assets/calendar.png"

export default function CalendarFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/calendar-title")
  const translatedText = t("@ordo-activity-features/calendar-text")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <div className="flex h-full justify-center flex-col items-center space-y-8">
        <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

        <img
          className="rounded-lg w-full md:w-2/3 block shadow-lg"
          src={calendar}
          alt="Command Palette"
        />

        <div className="max-w-md">{translatedText}</div>
      </div>
    </div>
  )
}
