import type { Activity } from "@client/activity-bar/types"

import React from "react"

import ActivityBarItem from "@client/activity-bar/components/activity-bar-item"

type Props = {
  activities: Activity[]
  currentActivity: string
}

/**
 * ActivityBar icon section with a set of icons displayed either at the top or
 * at the bottom of the ActivityBar.
 */
export default function ActivityGroup({ activities, currentActivity }: Props) {
  return (
    <div className="flex flex-col space-y-4 items-center activity-bar-group">
      {activities.map((activity) => (
        <ActivityBarItem
          key={activity.name}
          icon={activity.icon}
          name={activity.name}
          currentActivityName={currentActivity}
        />
      ))}
    </div>
  )
}
