import { ActionListItem } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"
import { useNavigate, useParams } from "react-router-dom"

export default function CalendarSidebar() {
  const { view } = useParams()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const day = t("@ordo-activity-editor/day")
  const week = t("@ordo-activity-editor/week")
  const month = t("@ordo-activity-editor/month")

  return (
    <div className="p-2">
      <ActionListItem
        isCurrent={view === "day"}
        text={day}
        onClick={() => navigate("/calendar/day")}
        Icon={() => <BsCalendarDay />}
      />
      <ActionListItem
        isCurrent={view === "week"}
        text={week}
        onClick={() => navigate("/calendar/week")}
        Icon={() => <BsCalendarWeek />}
      />
      <ActionListItem
        isCurrent={view === "month"}
        text={month}
        onClick={() => navigate("/calendar/month")}
        Icon={() => <BsCalendarMonth />}
      />
    </div>
  )
}
