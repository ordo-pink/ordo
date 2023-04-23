import { hideCommandPalette } from "@ordo-pink/stream-command-palette"
import { createExtension } from "@ordo-pink/stream-extensions"
import { LexicalNode } from "lexical"
import { lazy } from "react"
import { BsCalendarDay, BsCalendarMonth, BsCalendarWeek } from "react-icons/bs"
import { OrdoDateNode } from "./ordo-date/node"
import { ORDO_DATE_TRANSFORMER } from "./ordo-date/transformer"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createExtension(
  "calendar",
  ({
    commands,
    registerActivity,
    registerTranslations,
    registerCommandPaletteItem,
    registerEditorPlugin,
    translate,
  }) => {
    registerActivity("calendar", {
      routes: ["/calendar/week", "/calendar/:view"],
      Component: lazy(() => import("./components/component")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })

    registerTranslations({ ru, en })

    registerEditorPlugin("kanban-plugin", {
      nodes: [OrdoDateNode as unknown as typeof LexicalNode],
      transformer: ORDO_DATE_TRANSFORMER,
    })

    commands.on("open-calendar", () => {
      commands.emit("calendar.open-week-view", "/calendar")
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
      },
    })

    registerCommandPaletteItem({
      id: "calendar.open-week-view",
      name: translate("open-week-view"),
      Icon: BsCalendarWeek,
      onSelect: () => {
        commands.emit("calendar.open-week-view")
      },
    })

    registerCommandPaletteItem({
      id: "calendar.open-month-view",
      name: translate("open-month-view"),
      Icon: BsCalendarMonth,
      onSelect: () => {
        commands.emit("calendar.open-month-view")
      },
    })
  },
)
