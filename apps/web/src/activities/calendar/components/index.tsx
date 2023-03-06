import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import {
  OrdoButtonSecondary,
  OrdoButtonPrimary,
  useWorkspaceWithSidebar,
  useWindowSize,
} from "@ordo-pink/react"
import { EventObject, TZDate } from "@toast-ui/calendar/*"
import ToastCalendar from "@toast-ui/react-calendar"
import ToastUIReactCalendar from "@toast-ui/react-calendar"
import { LegacyRef, useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { BsArrowClockwise, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { createSearchParams, Navigate, useNavigate, useParams } from "react-router-dom"
import CalendarSidebar from "./sidebar"
import { updatedFile, updateFileMetadata } from "../../../containers/app/store"
import { useFSAPI } from "../../../core/hooks/use-fs-api"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { findOrdoFile, getFiles } from "../../../core/utils/fs-helpers"

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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const root = useAppSelector((state) => state.app.personalProject)

  const { view } = useParams<{ view: "day" | "week" | "month" }>()
  const { t } = useTranslation()
  const [width] = useWindowSize()

  const { files } = useFSAPI()

  const [isWide, setIsWide] = useState(false)

  const [events, setEvents] = useState<EventObject[]>([])

  useEffect(() => {
    if (!root) return

    const dates = [
      ...getFiles(root)
        .filter((file) => Boolean(file.metadata.dates))
        .map((file) =>
          (file.metadata.dates as { start: Date; end: Nullable<Date> }[]).map(({ start, end }) => ({
            start,
            end,
            title: file.readableName,
            body: file.path,
            backgroundColor: "#cbd5e1",
            color: "#1e293b",
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

    // calendarRef.current.calendarInstance.on("selectDateTime", console.log) // When selected range in calendar
    // calendarRef.current.calendarInstance.on("beforeCreateEvent", console.log)
    // calendarRef.current.calendarInstance.on("beforeDeleteEvent", console.log)
    // calendarRef.current.calendarInstance.on("afterRenderEvent", console.log) // When moved
    // calendarRef.current.calendarInstance.on("clickDayName", console.log) // When header clicked
    calendarRef.current.calendarInstance.on("clickEvent", ({ event }) => {
      if (OrdoFile.isValidPath(event.body)) {
        navigate({
          pathname: "/editor",
          search: createSearchParams({ path: event.body }).toString(),
        })
      }
    })
    // calendarRef.current.calendarInstance.on("clickMoreEventsBtn", console.log)
    // calendarRef.current.calendarInstance.on("clickTimezonesCollapseBtn", console.log)
    calendarRef.current.calendarInstance.on("beforeUpdateEvent", ({ event, changes }) => {
      files.get(event.body).then((content) => {
        const file = findOrdoFile(event.body, root)

        if (!file) return

        const startDate = (changes.start as TZDate)?.toDate() ?? event.start.toDate()
        const endDate = (changes.end as TZDate)?.toDate() ?? event.end?.toDate() ?? null

        const oldStartDate = event.start.toDate()
        const oldEndDate = event.end?.toDate()

        const oldDateStr = `${event.start.toDate().toISOString()}${
          event.end ? `>>>${event.end.toDate().toISOString()}` : ""
        }`
        const newDateStr = `${startDate.toISOString()}${
          endDate ? `>>>${endDate.toISOString()}` : ""
        }`

        const newContent = content.replace(oldDateStr, newDateStr)

        const newFile = OrdoFile.from({
          path: file.path,
          size: file.size,
          metadata: {
            ...file.metadata,
            dates: [
              ...(file.metadata as { dates: { start: string; end?: string }[] }).dates.filter(
                ({ start, end }) =>
                  start !== oldStartDate.toISOString() || oldEndDate
                    ? end !== oldEndDate.toISOString()
                    : true,
              ),
              { start: startDate.toISOString(), end: endDate.toISOString() },
            ],
          },
          updatedAt: file.updatedAt,
        }) as IOrdoFile<{
          dates: { start: string; end: string }[]
        }>

        dispatch(updateFileMetadata(newFile))
        dispatch(updatedFile({ file: newFile, content: newContent }))
      })
    })
  }, [calendarRef, root, dispatch, files, navigate])

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
          ref={calendarRef as LegacyRef<ToastUIReactCalendar>}
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
            monthGridHeaderExceed: (hiddenEventsCount) =>
              t("@ordo-activity-editor/exceed", { count: hiddenEventsCount }) as string,
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
