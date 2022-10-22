import React, { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"
import { useCommands } from "@client/common/hooks/use-commands"
import { addActivity, selectActivity } from "@client/activity-bar/store"

import ActivityGroup from "@client/activity-bar/components/activity-bar-group"
import { Extensions } from "@extensions/index"
import { OrdoActivityExtension } from "@core/types"

/**
 * ActivityBar allows the user to switch between separate parts of the
 * application, e.g. Editor, Graph, Checkboxes, Calendar, etc.
 */
export default function ActivityBar() {
  const dispatch = useAppDispatch()

  const activities = useAppSelector((state) => state.activityBar.activities)
  const requiredActivities = useAppSelector((state) => state.activityBar.requiredActivities)
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  useEffect(() => {
    Extensions.forEach((extension) => {
      if (extension.name.startsWith("ordo-activity-")) {
        const { icon, name } = extension as OrdoActivityExtension<string>

        dispatch(addActivity({ icon, name }))
      }
    })

    // TODO: Replace store reducer if extension extends store
  }, [Extensions])

  // TODO: Move this when extracting activities to extensions
  useCommands([
    {
      title: "@editor/open-activity",
      icon: "BsLayoutTextWindow",
      accelerator: "ctrl+shift+e",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("editor")),
    },
    {
      title: "@notifications/open-activity",
      icon: "BsBell",
      accelerator: "ctrl+alt+n",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("notifications")),
    },
    {
      title: "@account/open-activity",
      icon: "BsPerson",
      accelerator: "ctrl+alt+a",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("account")),
    },
    {
      title: "@achievements/open-activity",
      icon: "BsAward",
      accelerator: "ctrl+shift+y",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("achievements")),
    },
    {
      title: "@extensions/open-activity",
      icon: "BsPuzzle",
      accelerator: "ctrl+alt+e",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("extensions")),
    },
    {
      title: "@settings/open-activity",
      icon: "FaCogs",
      accelerator: "ctrl+,",
      showInCommandPalette: true,
      action: (_, { dispatch }) => dispatch(selectActivity("settings")),
    },
  ])

  return (
    <div className="fixed top-0 left-0 bottom-0 flex flex-col items-center justify-between py-4 pl-4 pr-2 bg-neutral-200 dark:bg-neutral-900 activity-bar">
      <ActivityGroup activities={activities} currentActivity={currentActivity} />

      <ActivityGroup activities={requiredActivities} currentActivity={currentActivity} />
    </div>
  )
}
