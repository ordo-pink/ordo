import { IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import {
  OrdoButtonSecondary,
  OrdoButtonPrimary,
  useWindowSize,
  useDrive,
  useCommands,
  useFsDriver,
  useRouteParams,
  Null,
} from "@ordo-pink/react-utils"
import { EventObject, TZDate } from "@toast-ui/calendar/*"
import ToastCalendar from "@toast-ui/react-calendar"
import ToastUIReactCalendar from "@toast-ui/react-calendar"
import { LegacyRef, useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { BsArrowClockwise, BsChevronLeft, BsChevronRight } from "react-icons/bs"

import "@toast-ui/calendar/dist/toastui-calendar.min.css"
import "tui-date-picker/dist/tui-date-picker.min.css"
import "tui-time-picker/dist/tui-time-picker.min.css"

import "./index.css"

// import YearView from "./components/year-view"
// BsCalendar3 icon for YearButton

export default function Calendar() {
  const calendarRef = useRef<ToastUIReactCalendar>()
  const drive = useDrive()
  const driver = useFsDriver()
  const { emit } = useCommands()
  const { view } = useRouteParams<"view">()

  const { t } = useTranslation("calendar")
  const [width] = useWindowSize()

  const [isWide, setIsWide] = useState(false)
  const [events, setEvents] = useState<EventObject[]>([])

  useEffect(() => {
    if (!drive) return

    const dates = drive.root
      .getFilesDeep()
      .filter((file) => Boolean(file.metadata["dates"]))
      .flatMap((file) =>
        (file.metadata["dates"] as { start: Date; end: Nullable<Date> }[]).map(({ start, end }) => {
          return {
            start,
            end,
            isAllday: !end,
            category: !end ? "allday" : "time",
            title: file.readableName,
            body: file.path,
            backgroundColor: "#a78bfa",
            color: "#4c1d95",
          }
        }),
      )

    setEvents(dates)
  }, [drive])

  useEffect(() => {
    setIsWide(width >= 768)
  }, [width])

  useEffect(() => {
    if (!calendarRef.current || !calendarRef.current.calendarInstance || !emit) return

    calendarRef.current.calendarInstance.on("selectDateTime", ({ start, end }) => {
      emit("fs.show-create-file-modal", {
        parent: drive?.root,
        content: `${start.toISOString()}>>>${end.toISOString()}`,
      })
    })

    calendarRef.current.calendarInstance.on("clickEvent", ({ event }) => {
      if (OrdoFile.isValidPath(event.body)) {
        emit("editor.open-file-in-editor", event.body)
      }
    })

    const onBeforeUpdateEvent = calendarRef.current.calendarInstance.on(
      "beforeUpdateEvent",
      ({ event, changes }) => {
        if (!driver || !drive || !emit) return

        driver.files
          .getContent(event.body)
          .then((res) => res.text())
          .then((content) => {
            const file = OrdoDirectory.findFileDeep(event.body, drive.root)

            if (!file) return

            const startDate = (changes.start as TZDate)?.toDate() ?? event.start.toDate()
            const endDate = (changes.end as TZDate)?.toDate() ?? event.end?.toDate() ?? null

            const oldStartDate = event.start.toDate()
            const oldEndDate = event.end?.toDate() ?? null

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
                  ...(file.metadata as { dates: { start: Date; end?: Date }[] }).dates.filter(
                    ({ start, end }) => {
                      return start !== oldStartDate.toISOString() || end
                        ? new Date(end as Date).toISOString() !== oldEndDate.toISOString()
                        : true
                    },
                  ),
                  { start: startDate.toISOString(), end: endDate.toISOString() },
                ],
              },
              updatedAt: file.updatedAt,
            }) as IOrdoFile<{
              dates: { start: string; end: string }[]
            }>

            emit("fs.update-file", newFile)
            emit("editor.update-file-content", { file: newFile, content: newContent })
          })
      },
    )

    return () => {
      if (onBeforeUpdateEvent?.eventBus?.events?.beforeUpdateEvent) {
        onBeforeUpdateEvent.eventBus.events.beforeUpdateEvent = []
      }
      if (onBeforeUpdateEvent?.eventBus?.events?.clickEvent) {
        onBeforeUpdateEvent.eventBus.events.clickEvent = []
      }
      if (onBeforeUpdateEvent?.eventBus?.events?.selectDateTime) {
        onBeforeUpdateEvent.eventBus.events.selectDateTime = []
      }
    }
  }, [calendarRef.current, drive, emit])

  const sun = t("sun")
  const mon = t("mon")
  const tue = t("tue")
  const wed = t("wed")
  const thu = t("thu")
  const fri = t("fri")
  const sat = t("sat")

  const translatedTitle = t("title")
  const allDayTitle = t("all-day")
  const popupIsAllDay = t("popup-is-allday")
  const titlePlaceHolder = t("title-placeholder")
  const popupSave = t("popup-save")
  const popupEdit = t("popup-edit")
  const popupDelete = t("popup-delete")

  const nextView = t("next-view")
  const currentView = t("current-view")
  const previousView = t("previous-view")

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

  return Either.fromNullable(view).fold(Null, (view) => (
    <div className="p-4 w-full h-screen flex flex-col items-center">
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

      <div className="calendar-wrapper justify-self-center">
        <ToastCalendar
          ref={calendarRef as LegacyRef<ToastUIReactCalendar>}
          view={view as "month" | "day" | "week"}
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
            milestone: () => "milestone",
            taskTitle: () => "taskTitle",
            task: () => "task",
            alldayTitle: () => allDayTitle,
            allday: () => "allday",
            time: (event) => event.title,
            goingDuration: () => "goingDuration",
            comingDuration: () => "comingDuration",
            monthMoreTitleDate: (moreTitle) => new Date(moreTitle.ymd).toLocaleDateString(),
            monthMoreClose: () => "⨯",
            // monthGridHeader: (cellData) => "cellData",
            monthGridHeaderExceed: (hiddenEventsCount) =>
              t("@ordo-activity-editor/exceed", { count: hiddenEventsCount }) as string,
            monthGridFooter: () => "monthGridFooter",
            monthGridFooterExceed: () => "monthGridFooterExceed",
            // monthDayName: (monthDayNameData) => "monthDayName",
            weekGridFooterExceed: () => "weekGridFooterExceed",
            collapseBtnTitle: () => "collapseBtnTitle",
            timezoneDisplayLabel: () => "timezoneDisplayLabel",
            timegridDisplayPrimaryTime: (props) => `${props.time.getHours()}:00`,
            timegridDisplayTime: () => "timegridDisplayTime",
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
            popupDetailLocation: () => "popupDetailLocation",
            popupDetailAttendees: () => "popupDetailAttendees",
            popupDetailState: () => "popupDetailState",
            popupDetailRecurrenceRule: () => "popupDetailRecurrenceRule",
            popupDetailBody: () => "popupDetailBody",
            popupEdit: () => popupEdit,
            popupDelete: () => popupDelete,
          }}
        />
      </div>
    </div>
  ))
}
