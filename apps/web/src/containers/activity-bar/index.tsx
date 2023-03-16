import { memo } from "react"
import ActivityBarActivity from "../../containers/activity-bar/components/activity"
import { useAppSelector } from "../../core/state/hooks/use-app-selector"

function ActivityBar() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  return (
    <div className="fixed left-0 bottom-0 right-0 flex space-x-2 justify-center items-center bg-neutral-100 p-1 dark:bg-neutral-800 z-50">
      {activities.map((activity) => (
        <ActivityBarActivity
          key={activity.name}
          activity={activity}
        />
      ))}
    </div>
  )
}

export default memo(ActivityBar, () => true)
