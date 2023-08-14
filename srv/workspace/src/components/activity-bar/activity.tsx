import { Activity, useCurrentActivity } from "../../streams/extensions"
import { Link } from "../link"

type Props = {
	activity: Activity
}

/**
 * ActivityBarActivity is the Icon user can click to get to the activity.
 */
export default function ActivityBarActivity({ activity }: Props) {
	const currentActivity = useCurrentActivity()

	const activityRoute = activity.routes[0]
	const Icon = activity.Icon

	return (
		<Link
			className={`!text-neutral-700 dark:!text-neutral-300 hover:!text-purple-600 dark:hover:!text-purple-400 transition-all duration-300 text-2xl leading-[0] rounded-lg ${
				currentActivity && currentActivity.name === activity.name
					? "!text-pink-700 dark:!text-pink-500 hover:!text-purple-600 dark:hover:!text-purple-400"
					: ""
			}`}
			href={activityRoute}
		>
			<Icon />
		</Link>
	)
}
