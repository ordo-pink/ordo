import ActivityBarActivity from "$containers/activity-bar/components/activity"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"

import "$containers/activity-bar/index.css"

export default function ActivityBar() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  return (
    <div className="activity-bar">
      {activities.map((activity) => (
        <ActivityBarActivity
          key={activity.name}
          activity={activity}
        />
      ))}
    </div>
  )
}
