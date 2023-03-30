import { hideCommandPalette } from "@ordo-pink/stream-command-palette"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createExtension(
  "calendar",
  ({ commands, registerActivity, registerTranslations, registerCommandPaletteItem, translate }) => {
    registerActivity("calendar", {
      routes: ["/calendar", "/calendar/:view"],
      Component: lazy(() => import("./components/component")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })

    registerTranslations({ ru, en })

    commands.on("open-calendar", () => {
      commands.emit("router.navigate", "/calendar")
    })

    commands.on("open-week-view", () => {
      commands.emit("router.navigate", "/calendar/week")
    })

    commands.on("open-day-view", () => {
      commands.emit("router.navigate", "/calendar/day")
    })

    commands.on("open-month-view", () => {
      commands.emit("router.navigate", "/calendar/month")
    })

    registerCommandPaletteItem({
      id: "calendar.open-day-view",
      name: translate("open-day-view"),
      Icon: BsCalendarDay,
      onSelect: () => {
        commands.emit("calendar.open-day-view")
        hideCommandPalette()
      },
    })

    registerCommandPaletteItem({
      id: "calendar.open-week-view",
      name: translate("open-week-view"),
      Icon: BsCalendarWeek,
      onSelect: () => {
        commands.emit("calendar.open-week-view")
        hideCommandPalette()
      },
    })

    registerCommandPaletteItem({
      id: "calendar.open-month-view",
      name: translate("open-month-view"),
      Icon: BsCalendarMonth,
      onSelect: () => {
        commands.emit("calendar.open-month-view")
        hideCommandPalette()
      },
    })
  },
)
