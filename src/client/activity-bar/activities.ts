import type { Activity } from "@client/activity-bar/types"

/**
 * A list of activities natively supported by Ordo.
 * 3rd party activities also go here.
 * TODO: Move this when extracting activities
 */
export const topActivities: Activity[] = [
  {
    name: "editor",
    icon: "BsLayoutTextWindow",
  },
  {
    name: "graph",
    icon: "BsShare",
  },
  {
    name: "checkboxes",
    icon: "BsCheck2Square",
  },
  {
    name: "tags",
    icon: "BsTags",
  },
  {
    name: "calendar",
    icon: "BsCalendarDate",
  },
  {
    name: "find-in-files",
    icon: "BsSearch",
  },
]

/**
 * A list of static activities that cannot be extended externally.
 * TODO: Move to initial state
 */
export const bottomActivities: Activity[] = [
  {
    icon: "BsBell",
    name: "notifications",
  },
  {
    icon: "BsPerson",
    name: "account",
  },
  {
    icon: "BsAward",
    name: "achievements",
  },
  {
    icon: "BsPuzzle",
    name: "extensions",
  },
  {
    icon: "FaCogs",
    name: "settings",
  },
]
