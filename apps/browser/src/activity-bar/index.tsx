import { Activity } from "@ordo-pink/common-types"
import ActivityBarActivity from "./components/activity"

type Props = {
  activities: Activity[]
}

export default function ActivityBar({ activities }: Props) {
  return (
    <div className="fixed left-0 bottom-0 right-0 flex space-x-2 justify-center items-center bg-neutral-100 p-1 dark:bg-neutral-800 z-50">
      {activities.map((activity, index) => (
        <ActivityBarActivity
          key={index}
          activity={activity}
        />
      ))}
    </div>
  )
}
