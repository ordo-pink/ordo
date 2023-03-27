import { Activity } from "@ordo-pink/common-types"
import ActivityBarActivity from "./components/activity"

type Props = {
  activities: Activity[]
}

export default function ActivityBar({ activities }: Props) {
  return (
    <div className="flex flex-col space-y-2 items-center p-2 text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-800">
      <div className="">
        {activities.map((activity, index) => (
          <ActivityBarActivity
            key={index}
            activity={activity}
          />
        ))}
      </div>
    </div>
  )
}
