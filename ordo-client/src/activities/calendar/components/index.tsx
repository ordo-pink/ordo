import { Switch } from "@ordo-pink/switch"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { BsCalendarDay, BsCalendarWeek, BsCalendarMonth, BsCalendar3 } from "react-icons/bs"

import DayView from "$activities/calendar/components/day-view"
import MonthView from "$activities/calendar/components/month-view"
import WeekView from "$activities/calendar/components/week-view"

// import YearView from "$activities/calendar/components/year-view"
import { useWorkspace } from "$containers/workspace/hooks/use-workspace"
import { OrdoButtonSecondary } from "$core/components/buttons"

enum CalendarView {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export default function Calendar() {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-calendar/title")

  const [currentView, setCurrentView] = useState(CalendarView.MONTH)

  return (
    <Workspace>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <div className="flex items-center space-x-2 justify-center mt-4">
        <OrdoButtonSecondary
          onClick={() => setCurrentView(CalendarView.DAY)}
          outline={currentView === CalendarView.DAY}
        >
          <BsCalendarDay />
        </OrdoButtonSecondary>
        <OrdoButtonSecondary
          onClick={() => setCurrentView(CalendarView.WEEK)}
          outline={currentView === CalendarView.WEEK}
        >
          <BsCalendarWeek />
        </OrdoButtonSecondary>
        <OrdoButtonSecondary
          onClick={() => setCurrentView(CalendarView.MONTH)}
          outline={currentView === CalendarView.MONTH}
        >
          <BsCalendarMonth />
        </OrdoButtonSecondary>
        <OrdoButtonSecondary
          onClick={() => setCurrentView(CalendarView.YEAR)}
          outline={currentView === CalendarView.YEAR}
        >
          <BsCalendar3 />
        </OrdoButtonSecondary>
      </div>

      <div className="flex flex-col">
        {Switch.of(currentView)
          .case(CalendarView.DAY, () => <DayView />)
          .case(CalendarView.WEEK, () => <WeekView />)
          .case(CalendarView.MONTH, () => <MonthView />)
          // .case(CalendarView.YEAR, () => <YearView />)
          .default(() => null)}
      </div>
    </Workspace>
  )
}
