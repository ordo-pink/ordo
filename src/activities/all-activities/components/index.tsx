import { useEffect, useState } from "react"

import AllActivitiesActivity from "$activities/all-activities/components/activity"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { OrdoActivityExtension } from "$core/types"

import "$activities/all-activities/index.css"

export default function AllActivities() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  const [visibleActivities, setVisibleActivities] = useState<OrdoActivityExtension<string>[]>([])

  useEffect(() => {
    activities &&
      setVisibleActivities(
        activities.filter((activity) => activity.name !== "ordo-activity-all-activities"),
      )
  }, [activities])

  return (
    <div className="all-activities">
      {visibleActivities.map((activity) => (
        <AllActivitiesActivity
          key={activity.name}
          activity={activity}
        />
      ))}
    </div>
  )
}
