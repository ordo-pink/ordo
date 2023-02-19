import ActivityBarActivity from "../../containers/activity-bar/components/activity"
import { useAppSelector } from "../../core/state/hooks/use-app-selector"

export default function ActivityBar() {
  const activities = useAppSelector((state) => state.app.activityExtensions)

  return (
    <div className="flex flex-col h-full items-center bg-neutral-100 p-1 dark:bg-neutral-800">
      {activities.map((activity) => (
        <ActivityBarActivity
          key={activity.name}
          activity={activity}
        />
      ))}
    </div>
  )
}
