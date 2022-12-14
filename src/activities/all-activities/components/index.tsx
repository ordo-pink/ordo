import { useEffect, useState } from "react"

import AllActivitiesActivity from "$activities/all-activities/components/activity"
import { useWorkspace } from "$containers/workspace/hooks/use-workspace.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { OrdoActivityExtension } from "$core/types"

import "$activities/all-activities/index.css"

export default function AllActivities() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  const [visibleActivities, setVisibleActivities] = useState<OrdoActivityExtension<string>[]>([])

  const Workspace = useWorkspace()

  useEffect(() => {
    activities &&
      setVisibleActivities(
        activities.filter((activity) => activity.name !== "ordo-activity-all-activities"),
      )
  }, [activities])

  return (
    <Workspace>
      <div className="all-activities">
        {visibleActivities.map((activity) => (
          <AllActivitiesActivity
            key={activity.name}
            activity={activity}
          />
        ))}
      </div>
    </Workspace>
  )
}
