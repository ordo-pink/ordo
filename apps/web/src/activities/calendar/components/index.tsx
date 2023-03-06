import { Either } from "@ordo-pink/either"
import {
  OrdoButtonSecondary,
  OrdoButtonPrimary,
  useWorkspaceWithSidebar,
  useWindowSize,
} from "@ordo-pink/react"
import { EventObject } from "@toast-ui/calendar/*"
import ToastCalendar from "@toast-ui/react-calendar"
import ToastUIReactCalendar from "@toast-ui/react-calendar"
import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { BsArrowClockwise, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { Navigate, useParams } from "react-router-dom"
import CalendarSidebar from "./sidebar"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { getFiles } from "../../../core/utils/fs-helpers"

import "@toast-ui/calendar/dist/toastui-calendar.min.css"
import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"

import "./index.css"

// import YearView from "./components/year-view"
// BsCalendar3 icon for YearButton

const RedirectToDayView = () => <Navigate to="/calendar/week" />

export default function Calendar() {
  const Workspace = useWorkspaceWithSidebar()
  const calendarRef = useRef<ToastUIReactCalendar>()

  const root = useAppSelector((state) => state.app.personalProject)

  const { view } = useParams<{ view: "day" | "week" | "month" }>()
  const { t } = useTranslation()
  const [width] = useWindowSize()

  const [isWide, setIsWide] = useState(false)

  const [events, setEvents] = useState<EventObject[]>([])

  useEffect(() => {
    if (!root) return

    const dates = [
      ...getFiles(root)
        .filter((file) => Boolean(file.metadata.dates))
        .map((file) =>
          (file.metadata.dates as any).map(({ start, end }: any) => ({
            start,
            end,
            title: file.readableName,
            body: file.path,
          })),
        )
        .flat(),
    ]

    setEvents(dates)
  }, [root])

  useEffect(() => {
    setIsWide(width >= 768)
  }, [width])

  useEffect(() => {
    if (!calendarRef.current || !calendarRef.current.calendarInstance) return

    calendarRef.current.calendarInstance.on("selectDateTime", console.log) // When selected range in calendar
    calendarRef.current.calendarInstance.on("beforeCreateEvent", console.log)
    calendarRef.current.calendarInstance.on("beforeUpdateEvent", console.log)
    calendarRef.current.calendarInstance.on("beforeDeleteEvent", console.log)
    calendarRef.current.calendarInstance.on("afterRenderEvent", console.log) // When moved
    calendarRef.current.calendarInstance.on("clickDayName", console.log) // When header clicked
    calendarRef.current.calendarInstance.on("clickEvent", ({ event }) => {
      // TODO: Show edit dialog
      // TODO: -> Remove (file)
      // TODO: -> Update (file)
    })
    calendarRef.current.calendarInstance.on("clickMoreEventsBtn", console.log)
    calendarRef.current.calendarInstance.on("clickTimezonesCollapseBtn", console.log)
  }, [calendarRef])

  const sun = t("@ordo-activity-calendar/sun")
  const mon = t("@ordo-activity-calendar/mon")
  const tue = t("@ordo-activity-calendar/tue")
  const wed = t("@ordo-activity-calendar/wed")
  const thu = t("@ordo-activity-calendar/thu")
  const fri = t("@ordo-activity-calendar/fri")
  const sat = t("@ordo-activity-calendar/sat")

  const translatedTitle = t("@ordo-activity-calendar/title")
  const allDayTitle = t("@ordo-activity-calendar/all-day")
  const popupIsAllDay = t("@ordo-activity-calendar/popup-is-allday")
  const titlePlaceHolder = t("@ordo-activity-calendar/title-placeholder")
  const popupSave = t("@ordo-activity-calendar/popup-save")
  const popupEdit = t("@ordo-activity-calendar/popup-edit")
  const popupDelete = t("@ordo-activity-calendar/popup-delete")

  const nextView = t("@ordo-activity-calendar/next-view")
  const currentView = t("@ordo-activity-calendar/current-view")
  const previousView = t("@ordo-activity-calendar/previous-view")

  const toNextView = () => {
    // TODO: Translate to query params
    if (!calendarRef.current || !calendarRef.current.calendarInstance) return

    calendarRef.current.calendarInstance.next()
  }

  const toPreviousView = () => {
    // TODO: Translate to query params
    if (!calendarRef.current || !calendarRef.current.calendarInstance) return

    calendarRef.current.calendarInstance.prev()
  }

  const toCurrentView = () => {
    // TODO: Translate to query params
    if (!calendarRef.current || !calendarRef.current.calendarInstance) return

    calendarRef.current.calendarInstance.today()
  }

  return Either.fromNullable(view).fold(RedirectToDayView, () => (
    <Workspace sidebarChildren={<CalendarSidebar />}>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <div className="flex items-center space-x-2 justify-center">
        <OrdoButtonSecondary
          onClick={toPreviousView}
          center
        >
          <div className="flex items-center space-x-2">
            <BsChevronLeft />
            {isWide && <div>{previousView}</div>}
          </div>
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          onClick={toCurrentView}
          center
        >
          <div className="flex items-center space-x-2">
            <BsArrowClockwise />
            {isWide && <div>{currentView}</div>}
          </div>
        </OrdoButtonPrimary>

        <OrdoButtonSecondary
          onClick={toNextView}
          center
        >
          <div className="flex items-center space-x-2">
            {isWide && <div>{nextView}</div>}
            <BsChevronRight />
          </div>
        </OrdoButtonSecondary>
      </div>

      <div className="calendar-wrapper">
        <ToastCalendar
          ref={calendarRef as any}
          view={view}
          month={{
            startDayOfWeek: 1,
            dayNames: [sun, mon, tue, wed, thu, fri, sat],
            isAlways6Weeks: true,
          }}
          week={{
            startDayOfWeek: 1,
            taskView: false,
            dayNames: [sun, mon, tue, wed, thu, fri, sat],
          }}
          height="80vh"
          events={events}
          usageStatistics={false}
          template={{
            milestoneTitle: () => "milestoneTitle",
            milestone: (event) => "milestone",
            taskTitle: () => "taskTitle",
            task: (event) => "task",
            alldayTitle: () => allDayTitle,
            allday: (event) => "allday",
            time: (event) => event.title,
            goingDuration: (event) => "goingDuration",
            comingDuration: (event) => "comingDuration",
            monthMoreTitleDate: (moreTitle) => "monthMoreTitleDate",
            monthMoreClose: () => "monthMoreClose",
            // monthGridHeader: (cellData) => "cellData",
            monthGridHeaderExceed: (hiddenEventsCount) => "monthGridHeaderExceed",
            monthGridFooter: (cellData) => "monthGridFooter",
            monthGridFooterExceed: (hiddenEventsCount: number) => "monthGridFooterExceed",
            // monthDayName: (monthDayNameData) => "monthDayName",
            weekGridFooterExceed: (hiddenEventsCount) => "weekGridFooterExceed",
            collapseBtnTitle: () => "collapseBtnTitle",
            timezoneDisplayLabel: (props) => "timezoneDisplayLabel",
            timegridDisplayPrimaryTime: (props) => `${props.time.getHours()}:00`,
            timegridDisplayTime: (props) => "timegridDisplayTime",
            timegridNowIndicatorLabel: (props) =>
              `${props.time.getHours()}:${
                props.time.getMinutes() < 10
                  ? `0${props.time.getMinutes()}`
                  : props.time.getMinutes()
              }`,
            popupIsAllday: () => popupIsAllDay,
            popupStateFree: () => "popupStateFree",
            popupStateBusy: () => "popupStateBusy",
            titlePlaceholder: () => titlePlaceHolder,
            locationPlaceholder: () => "locationPlaceholder",
            startDatePlaceholder: () => "startDatePlaceholder",
            endDatePlaceholder: () => "endDatePlaceholder",
            popupSave: () => popupSave,
            popupUpdate: () => "popupUpdate",
            popupDetailTitle: (event) => event.title,
            popupDetailDate: (event) => `${event.start.toString()} - ${event.end.toString()}`,
            popupDetailLocation: (event) => "popupDetailLocation",
            popupDetailAttendees: (event) => "popupDetailAttendees",
            popupDetailState: (event) => "popupDetailState",
            popupDetailRecurrenceRule: (event) => "popupDetailRecurrenceRule",
            popupDetailBody: (event) => "popupDetailBody",
            popupEdit: () => popupEdit,
            popupDelete: () => popupDelete,
          }}
        />
      </div>
    </Workspace>
  ))
}
