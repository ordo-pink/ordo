import Activity from "$activities/all-activities/components/activity"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"

import "$activities/all-activities/index.css"

export default function AllActivities() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  // TODO Extract styles, extract Link, make draggable
  return (
    <div className="all-activities">
      {activities
        .filter((item) => item.name !== "ordo-activity-all-activities")
        .map(({ name, Icon, readableName }) => (
          <Activity
            key={name}
            name={name}
            Icon={Icon}
            readableName={readableName}
          />
        ))}
    </div>
  )
}
