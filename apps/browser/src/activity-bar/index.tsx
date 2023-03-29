import { Activity } from "@ordo-pink/common-types"
import ActivityBarActivity from "./components/activity"

type Props = {
  activities: Activity[]
}

export default function ActivityBar({ activities }: Props) {
  return (
    <div className="flex flex-col space-y-4 items-center px-2 justify-center text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-800">
      {activities.map((activity, index) =>
        activity.show ?? true ? (
          <ActivityBarActivity
            key={index}
            activity={activity}
          />
        ) : null,
      )}
    </div>
  )
}
