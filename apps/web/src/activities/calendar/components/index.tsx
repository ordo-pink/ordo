import { useWorkspace } from "@ordo-pink/react"
import ToastCalendar from "@toast-ui/react-calendar"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import ToastUIReactCalendar from "@toast-ui/react-calendar"

import "@toast-ui/calendar/dist/toastui-calendar.min.css"
import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"
import "./index.css"
import { EventObject } from "@toast-ui/calendar/dist/toastui-calendar.min.css"

export default function Calendar() {
  const Workspace = useWorkspace()

  const calendarRef = useRef<ToastUIReactCalendar>(null)

  useEffect(() => {
    if (!calendarRef.current || !calendarRef.current.calendarInstance) return

    calendarRef.current.calendarInstance.on("selectDateTime", console.log) // When selected range in calendar
    calendarRef.current.calendarInstance.on("beforeCreateEvent", console.log)
    calendarRef.current.calendarInstance.on("beforeUpdateEvent", console.log)
    calendarRef.current.calendarInstance.on("beforeDeleteEvent", console.log)
    calendarRef.current.calendarInstance.on("afterRenderEvent", console.log) // When moved
    calendarRef.current.calendarInstance.on("clickDayName", console.log) // When header clicked
    calendarRef.current.calendarInstance.on("clickEvent", ({ event }) => {
      console.log(event)
      // TODO: Show edit dialog
      // TODO: -> Remove (file)
      // TODO: -> Update (file)
    })
    calendarRef.current.calendarInstance.on("clickMoreEventsBtn", console.log)
    calendarRef.current.calendarInstance.on("clickTimezonesCollapseBtn", console.log)
  }, [calendarRef])

  const { t } = useTranslation()

  const sun = t("@ordo-activity-calendar/sun")
  const mon = t("@ordo-activity-calendar/mon")
  const tue = t("@ordo-activity-calendar/tue")
  const wed = t("@ordo-activity-calendar/wed")
  const thu = t("@ordo-activity-calendar/thu")
  const fri = t("@ordo-activity-calendar/fri")
  const sat = t("@ordo-activity-calendar/sat")

  const allDayTitle = t("@ordo-activity-calendar/all-day")
  const popupIsAllDay = t("@ordo-activity-calendar/popup-is-allday")
  const titlePlaceHolder = t("@ordo-activity-calendar/title-placeholder")
  const popupSave = t("@ordo-activity-calendar/popup-save")
  const popupEdit = t("@ordo-activity-calendar/popup-edit")
  const popupDelete = t("@ordo-activity-calendar/popup-delete")

  const dow = [sun, mon, tue, wed, thu, fri, sat]

  const [events, setEvents] = useState<EventObject[]>([
    {
      id: "1",
      title: "Lunch",
      category: "time",
      start: new Date(Date.now() + 1000 * 60 * 60 * 3),
      end: new Date(Date.now() + 1000 * 60 * 60 * 7),
    },
  ])

  return (
    <Workspace>
      <div className="calendar-wrapper">
        <ToastCalendar
          ref={calendarRef as any}
          view="week"
          week={{
            startDayOfWeek: 1,
            taskView: false,
          }}
          month={{ startDayOfWeek: 1, isAlways6Weeks: true }}
          height="85vh"
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
            monthGridHeader: (cellData) => "monthGridHeader",
            monthGridHeaderExceed: (hiddenEventsCount) => "monthGridHeaderExceed",
            monthGridFooter: (cellData) => "monthGridFooter",
            monthGridFooterExceed: (hiddenEventsCount: number) => "monthGridFooterExceed",
            monthDayName: (monthDayNameData) => "monthDayName",
            weekDayName: (weekDayNameData) => dow[weekDayNameData.day],
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
  )
}
