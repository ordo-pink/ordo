/* eslint-disable @typescript-eslint/no-explicit-any */
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react"
import React, { Component } from "react"
import "./calendar-styles.css"

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
}

class Calendar extends Component {
  calendarRef: React.RefObject<any>

  constructor(props: any) {
    super(props)
    this.calendarRef = React.createRef()
    this.state = {
      viewType: "Day",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args: any) => {
        const dp = this.calendar
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1")
        dp.clearSelection()
        if (!modal.result) {
          return
        }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result,
        })
      },
      eventDeleteHandling: "Update",
      onEventClick: async (args: any) => {
        const dp = this.calendar
        const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text())
        if (!modal.result) {
          return
        }
        const e = args.e
        e.data.text = modal.result
        dp.events.update(e)
      },
    }
  }

  get calendar() {
    return this.calendarRef.current.control
  }

  componentDidMount() {
    const events = [
      {
        id: 1,
        text: "Event 1",
        start: "2023-03-07T10:30:00",
        end: "2023-03-07T13:00:00",
      },
    ]

    const startDate = "2023-03-07"

    this.calendar.update({ startDate, events })
  }

  render() {
    return (
      <div style={styles.wrap}>
        <div style={styles.left}>
          <DayPilotNavigator
            selectMode={"day"}
            showMonths={2}
            skipMonths={2}
            startDate={"2023-03-07"}
            selectionDay={"2023-03-07"}
            onTimeRangeSelected={(args: any) => {
              this.calendar.update({
                startDate: args.day,
              })
            }}
          />
        </div>
        <div style={styles.main}>
          <DayPilotCalendar
            {...this.state}
            ref={this.calendarRef}
          />
        </div>
      </div>
    )
  }
}

export default Calendar
