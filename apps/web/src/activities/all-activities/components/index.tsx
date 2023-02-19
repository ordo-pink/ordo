import { useEffect, useState } from "react"
import AllActivitiesActivity from "./activity"
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { OrdoActivityExtension } from "../../../core/types"
import "./index.css"

export default function AllActivities() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  const Workspace = useWorkspace()

  const [visibleActivities, setVisibleActivities] = useState<OrdoActivityExtension<string>[]>([])

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
