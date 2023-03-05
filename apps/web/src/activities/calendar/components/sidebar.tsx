import { ActionListItem } from "@ordo-pink/react"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"
import { useNavigate, useParams } from "react-router-dom"

export default function CalendarSidebar() {
  const { view } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-2">
      <ActionListItem
        isCurrent={view === "day"}
        text="Day"
        onClick={() => navigate("/calendar/day")}
        Icon={() => <BsCalendarDay />}
      />
      <ActionListItem
        isCurrent={view === "week"}
        text="Week"
        onClick={() => navigate("/calendar/week")}
        Icon={() => <BsCalendarWeek />}
      />
      <ActionListItem
        isCurrent={view === "month"}
        text="Month"
        onClick={() => navigate("/calendar/month")}
        Icon={() => <BsCalendarMonth />}
      />
    </div>
  )
}
