import { ActionListItem, useCommands, useRouteParams } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"

export default function CalendarSidebar() {
  const params = useRouteParams<{ view: string }>()
  const { emit } = useCommands()

  const { t } = useTranslation("calendar")

  const day = t("day")
  const week = t("week")
  const month = t("month")

  return (
    <div className="p-2">
      <ActionListItem
        isCurrent={params?.["view"] === "day"}
        text={day}
        onClick={() => emit("router.navigate", "/calendar/day")}
        Icon={() => <BsCalendarDay />}
      />
      <ActionListItem
        isCurrent={params?.["view"] === "week"}
        text={week}
        onClick={() => emit("router.navigate", "/calendar/week")}
        Icon={() => <BsCalendarWeek />}
      />
      <ActionListItem
        isCurrent={params?.["view"] === "month"}
        text={month}
        onClick={() => emit("router.navigate", "/calendar/month")}
        Icon={() => <BsCalendarMonth />}
      />
    </div>
  )
}
