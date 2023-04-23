import { ActionListItem, useCommands, useRouteParams } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"

export default function CalendarSidebar() {
  const { view } = useRouteParams<"view">()
  const { emit } = useCommands()

  const { t } = useTranslation("calendar")

  const day = t("day")
  const week = t("week")
  const month = t("month")

  return (
    <div className="p-2">
      <ActionListItem
        current={view === "day"}
        text={day}
        onClick={() => emit("router.navigate", "/calendar/day")}
        Icon={() => <BsCalendarDay />}
      />
      <ActionListItem
        current={view === "week"}
        text={week}
        onClick={() => emit("router.navigate", "/calendar/week")}
        Icon={() => <BsCalendarWeek />}
      />
      <ActionListItem
        current={view === "month"}
        text={month}
        onClick={() => emit("router.navigate", "/calendar/month")}
        Icon={() => <BsCalendarMonth />}
      />
    </div>
  )
}
